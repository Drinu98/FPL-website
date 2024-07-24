// import { NextResponse } from "next/server";

// import {
//   CaptainPick,
//   EffectiveOwnership,
//   prisma,
// } from "../../../../services/prisma";
// export async function POST(req: Request) {
//   const body = (await req.json()) as {
//     startPage: number;
//     endPage: number;
//     leagueId: number;
//     currentGameweek: number;
//     playerList: any[];
//   };

//   const { startPage, endPage, leagueId, currentGameweek, playerList } = body;
//   try {
//     console.time(`${startPage}-${endPage}`);

//     const data = [];
//     // console.log("STARTING LOOP - ", startPage, endPage);
//     const countMapBenched = new Map();
//     const promises = [] as Array<Promise<any>>;
//     for (let i = startPage; i <= endPage; i++) {
//       const page = i;
//       // console.log("LOOPING - ", page);
//       promises.push(
//         new Promise(async (resolve, reject) => {
//           const standingsResponse = await fetch(
//             `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`,
//             {
//               next: {
//                 revalidate: 0,
//               },
//             }
//           );
//           const data = await standingsResponse.json();

//           const standingsData = data?.standings;
//           if (standingsData?.results.length === 0) {
//             // break;
//             return resolve(true);
//           }

//           for (const playerEntry of standingsData?.results) {
//             const playerEntryId = playerEntry.entry;

//             const picksResponse = await fetch(
//               `https://fantasy.premierleague.com/api/entry/${playerEntryId}/event/${currentGameweek}/picks/`,
//               {
//                 next: {
//                   revalidate: 0,
//                 },
//               }
//             );

//             const playerPicks = await picksResponse.json();

//             const picksData = playerPicks?.entry_history;

//             const pointsOnBench = picksData?.points_on_bench;

//             countMapBenched.set(playerEntryId, {
//                 playerName: playerEntry.player_name,
//                 entryName: playerEntry.entry_name,
//                 currentRank: playerEntry.rank,
//                 lastRank: playerEntry.last_rank,
//                 eventTotal: playerEntry.event_total,
//                 benchedPoints: pointsOnBench,
//             });
//           }

//           return resolve(true);
//         })
//       );
//     }
//     await Promise.all(promises);
//     const mostBenchedPoints = Array.from(countMapBenched.entries()).map(
//         ([playerEntryId, { playerName, entryName, currentRank, lastRank, eventTotal, benchedPoints}]) => {
//           return {
//               playerEntryId,
//               entryName,
//               playerName,
//               eventTotal,
//               currentRank,
//               lastRank,
//               benchedPoints
//           };
//         }
//       );


//     await prisma.mostBenchedPoints.createMany({
//         data: [
//           ...mostBenchedPoints.map((item) => {
//             return {
//               ...item,
//             };
//           }),
//         ],
//       });
//     console.timeEnd(`${startPage}-${endPage}`);

//     return new NextResponse(
//       JSON.stringify({
//         message: "ok",
//       })
//     );
//   } catch (error) {
//     console.error(error);
//     console.timeEnd(`${startPage}-${endPage}`);

//     return new NextResponse(
//       JSON.stringify({
//         message: (error as Error).message,
//       })
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "../../../../services/prisma";

const BATCH_SIZE = 20;

interface StandingsPlayer {
  entry: number;
  entry_name: string;
  player_name: string;
  event_total: number;
  rank: number;
  last_rank: number;
}

interface PlayerPicks {
  entry_history: {
    points_on_bench: number;
  };
}

interface MostBenchedPointsItem {
  playerEntryId: number;
  entryName: string;
  playerName: string;
  eventTotal: number;
  currentRank: number;
  lastRank: number;
  benchedPoints: number;
}

async function fetchStandings(leagueId: number, page: number): Promise<StandingsPlayer[]> {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`,
    { next: { revalidate: 0 } }
  );
  return (await response.json())?.standings?.results || [];
}

async function fetchPlayerPicks(playerEntryIds: number[], currentGameweek: number): Promise<PlayerPicks[]> {
  const promises = playerEntryIds.map(id =>
    fetch(`https://fantasy.premierleague.com/api/entry/${id}/event/${currentGameweek}/picks/`, 
      { next: { revalidate: 0 } }
    ).then(res => res.json())
  );
  return Promise.all(promises);
}

export async function POST(req: Request) {
  const { startPage, endPage, leagueId, currentGameweek } = await req.json();

  try {
    console.time(`${startPage}-${endPage}`);

    const mostBenchedPoints: MostBenchedPointsItem[] = [];
    for (let page = startPage; page <= endPage; page++) {
      const standingsData = await fetchStandings(leagueId, page);
      if (standingsData.length === 0) break;

      for (let i = 0; i < standingsData.length; i += BATCH_SIZE) {
        const batch = standingsData.slice(i, i + BATCH_SIZE);
        const playerEntryIds = batch.map(player => player.entry);
        const playerPicks = await fetchPlayerPicks(playerEntryIds, currentGameweek);

        batch.forEach((player: StandingsPlayer, index: number) => {
          const picks = playerPicks[index];
          mostBenchedPoints.push({
            playerEntryId: player.entry,
            entryName: player.entry_name,
            playerName: player.player_name,
            eventTotal: player.event_total,
            currentRank: player.rank,
            lastRank: player.last_rank,
            benchedPoints: picks?.entry_history?.points_on_bench || 0,
          });
        });
      }
    }

    await prisma.mostBenchedPoints.createMany({ data: mostBenchedPoints });

    console.timeEnd(`${startPage}-${endPage}`);
    return new NextResponse(JSON.stringify({ message: "ok" }));
  } catch (error) {
    console.error(error);
    console.timeEnd(`${startPage}-${endPage}`);
    return new NextResponse(JSON.stringify({ message: (error as Error).message }));
  }
}