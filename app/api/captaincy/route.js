import { NextResponse } from 'next/server';

export async function GET() {
    const leagueId = 314; // Change league ID to your league ID
    const maxRank = 10000; // Change max number of players to retrieve
  
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
      next: {
        revalidate: 120
      },
    }
  );

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }
  
    const data = await res.json();

    const events = data?.events;
    const playerList = data?.elements;

    const currentGameweekData = events?.find(event => event?.is_current === true);
    const currentGameweek = currentGameweekData?.id;

    const countMap = new Map();
    const processedPlayers = {};

    let totalPages = 202; // Change to the total number of pages to fetch
    let page = 1;
    let playersProcessed = 0;
    

    while (page <= totalPages && playersProcessed < maxRank) {
        const standingsResponse = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`, {});

        const data = await standingsResponse.json();

        const standingsData = data?.standings;

        if (standingsData?.results.length === 0) {
          totalPages = page - 1;
          break;
        }

        for (const playerEntry of standingsData?.results) {
          const playerEntryId = playerEntry.entry;
          if (processedPlayers[playerEntryId]) {
            continue;
          }

          const picksResponse = await fetch(`https://fantasy.premierleague.com/api/entry/${playerEntryId}/event/${currentGameweek}/picks/`, {});

          const data = await picksResponse.json();

          const picksData = data?.picks;
          const captainPick = picksData?.find(pick => pick.is_captain === true);
          const captainPlayer = playerList.find(player => player.id === captainPick.element);

          const playerName = captainPlayer?.web_name;
          if (playerName) {
            const count = countMap.get(playerName) ?? 0;
            countMap.set(playerName, count + 1);
          }

          processedPlayers[playerEntryId] = true;
          playersProcessed++;

          if (playersProcessed >= maxRank) {
            break;
          }
        }

        page++;
      }

      const countArray = Array.from(countMap.entries()).map(([name, count]) => ({ name, count }));

    
    return NextResponse.json({ currentGameweek, countArray })
}