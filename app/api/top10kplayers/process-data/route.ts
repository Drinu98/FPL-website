import { NextResponse } from 'next/server';

import {
  prisma
} from "../../../../services/prisma";
export async function POST(req: Request){
  const body = (await req.json()) as {
    startPage: number;
    endPage: number;
    leagueId: number;
    currentGameweek: number;
  };

  const { startPage, endPage, leagueId, currentGameweek} = body;
  try {
    console.time(`${startPage}-${endPage}`);

    const data = [];
    // console.log("STARTING LOOP - ", startPage, endPage);
    const top10kplayers = new Map();

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
            // const playerEntryId = playerEntry.entry;
            const entry = playerEntry.entry || 0;
            const playerName = playerEntry.player_name || '';
            const entryName = playerEntry.entry_name || '';
            const eventTotal = playerEntry.event_total || 0;
            const rank = playerEntry.rank || 0;
            const lastRank = playerEntry.last_rank || 0;
           
            top10kplayers.set(entry, {player_name: playerName, entry_name: entryName, total: eventTotal, rank: rank, lastRank: lastRank });
          }

          return resolve(true);
        })
      );
    }
    await Promise.all(promises);
    const top10k = Array.from(top10kplayers.entries()).map(
      ([entry, { player_name, entry_name, total, rank, lastRank }]) => {
        return {
            entry,
            player_name,
            entry_name,
            total,
            rank,
            lastRank,
        };
      }
    );
    await prisma.top10kPlayers.createMany({
      data: [
        ...top10k.map((item) => {
          return {
            entry: item.entry,
            entryName: item.entry_name,
            playerName: item.player_name,
            eventTotal: item.total,
            currentRank: item.rank,
            lastRank: item.lastRank
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
};
