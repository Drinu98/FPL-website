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
    const countMapCaptaincy = new Map();
    const countMapEo = new Map();
    const countMapTriple = new Map();
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

            const picksData = playerPicks?.picks;

            // console.log('PICKS DATA', picksData.length)
            const captainPick = picksData?.find(
              (pick: any) => pick.is_captain === true
            );
            const captainPlayer = playerList.find(
              (player) => player.id === captainPick.element
            );

            const playerName = captainPlayer?.web_name;
            const captainElementId = captainPlayer.id;
            if (playerName) {
              const count = countMapCaptaincy.get(captainElementId)?.count ?? 0;
              countMapCaptaincy.set(captainElementId, {
                name: playerName,
                count: count + 1,
              });
            }

            const triplePick = picksData?.find(
              (pick: any) => pick.is_captain === true && pick.multiplier === 3
            );

            const triplePlayer = playerList.find(
              (player) => player.id === triplePick?.element
            );

            const playerNameTriple = triplePlayer?.web_name;
            const tripleElementId = triplePlayer?.id;
            if (playerNameTriple) {
              const count = countMapTriple.get(tripleElementId)?.count ?? 0;
              countMapTriple.set(tripleElementId, {
                name: playerNameTriple,
                count: count + 1,
              });
            }

            picksData.forEach((pick: any) => {
              if (pick.multiplier > 0) {
                const player = playerList.find((player) => player.id === pick.element);
                const playerName = player?.web_name;
                const playerElementId = player?.id;
                if (playerName) {
                  const count = countMapEo.get(playerElementId)?.count ?? 0;
                  countMapEo.set(playerElementId, {
                    name: playerName,
                    count: count + 1,
                  });
                }
              }
            });
            
          }

          return resolve(true);
        })
      );
    }
    await Promise.all(promises);
    const captaincy = Array.from(countMapCaptaincy.entries()).map(
      ([playerElementId, { name, count }]) => {
        return {
          name,
          count,
          playerElementId,
        };
      }
    );

    const effectiveOwnership = Array.from(countMapEo.entries()).map(
      ([playerElementId, { name, count }]) => {
        return {
          name,
          count,
          playerElementId,
        };
      }
    );

    const triple = Array.from(countMapTriple.entries()).map(
      ([playerElementId, { name, count }]) => {
        return {
          name,
          count,
          playerElementId,
        };
      }
    );

    await prisma.playerPicks.createMany({
      data: [
        ...captaincy.map((item) => {
          return {
            ...item,
            type: "captaincy",
          };
        }),
        ...effectiveOwnership.map((item) => {
          return {
            ...item,
            type: "effectiveOwnership",
          };
        }),
        ...triple.map((item) => {
          return {
            ...item,
            type: "triple",
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
