import { NextResponse } from "next/server";

import {
  CaptainPick,
  EffectiveOwnership,
  prisma,
} from "../../../../services/prisma";
export async function POST(req: Request) {
  const body = (await req.json()) as {
    startPage: number;
    endPage: number;
    leagueId: number;
    currentGameweek: number;
    playerList: any[];
  };

  const { startPage, endPage, leagueId, currentGameweek, playerList } = body;
  try {
    console.time(`${startPage}-${endPage}`);

    const data = [];
    // console.log("STARTING LOOP - ", startPage, endPage);
    const countMapBenched = new Map();
    const promises = [] as Array<Promise<any>>;
    for (let i = startPage; i <= endPage; i++) {
      const page = i;
      // console.log("LOOPING - ", page);
      promises.push(
        new Promise(async (resolve, reject) => {
          const standingsResponse = await fetch(
            `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`,
            {
              next: {
                revalidate: 0,
              },
            }
          );
          const data = await standingsResponse.json();

          const standingsData = data?.standings;
          if (standingsData?.results.length === 0) {
            // break;
            return resolve(true);
          }

          for (const playerEntry of standingsData?.results) {
            const playerEntryId = playerEntry.entry;

            const picksResponse = await fetch(
              `https://fantasy.premierleague.com/api/entry/${playerEntryId}/event/${currentGameweek}/picks/`,
              {
                next: {
                  revalidate: 0,
                },
              }
            );

            const playerPicks = await picksResponse.json();

            const picksData = playerPicks?.entry_history;

            const pointsOnBench = picksData?.points_on_bench;

            countMapBenched.set(playerEntryId, {
                playerName: playerEntry.player_name,
                entryName: playerEntry.entry_name,
                currentRank: playerEntry.rank,
                lastRank: playerEntry.last_rank,
                eventTotal: playerEntry.event_total,
                benchedPoints: pointsOnBench,
            });
          }

          return resolve(true);
        })
      );
    }
    await Promise.all(promises);
    const mostBenchedPoints = Array.from(countMapBenched.entries()).map(
        ([playerEntryId, { playerName, entryName, currentRank, lastRank, eventTotal, benchedPoints}]) => {
          return {
              playerEntryId,
              entryName,
              playerName,
              eventTotal,
              currentRank,
              lastRank,
              benchedPoints
          };
        }
      );


    await prisma.mostBenchedPoints.createMany({
        data: [
          ...mostBenchedPoints.map((item) => {
            return {
              ...item,
            };
          }),
        ],
      });
    console.timeEnd(`${startPage}-${endPage}`);

    return new NextResponse(
      JSON.stringify({
        message: "ok",
      })
    );
  } catch (error) {
    console.error(error);
    console.timeEnd(`${startPage}-${endPage}`);

    return new NextResponse(
      JSON.stringify({
        message: (error as Error).message,
      })
    );
  }
}
