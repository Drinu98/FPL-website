import DisplayCaptaincy from './DisplayCaptaincy'

async function getCaptaincy() {
    const leagueId = 314; // Change league ID to your league ID
    const maxRank = 10000; // Change max number of players to retrieve
  
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
      next: {
        revalidate: 300
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

    const countMapCaptaincy = new Map();
    const countMapEo = new Map();
    const processedPlayers = {};

    let totalPages = 202; // Change to the total number of pages to fetch
    let page = 1;
    let playersProcessed = 0;
    

    while (page <= totalPages && playersProcessed < maxRank) {
        const standingsResponse = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`, 
        {
            next: {
              revalidate: 300
            },
        });

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

          const picksResponse = await fetch(`https://fantasy.premierleague.com/api/entry/${playerEntryId}/event/${currentGameweek}/picks/`, 
          {
            next: {
              revalidate: 300
            },
          });

          const data = await picksResponse.json();

          const picksData = data?.picks;
          const captainPick = picksData?.find(pick => pick.is_captain === true);
          const captainPlayer = playerList.find(player => player.id === captainPick.element);

          const playerName = captainPlayer?.web_name;
          if (playerName) {
            const count = countMapCaptaincy.get(playerName) ?? 0;
            countMapCaptaincy.set(playerName, count + 1);
          }

          picksData.forEach(pick => {
            const playerName = playerList.find(player => player.id === pick.element)?.web_name;
            if (playerName) {
              const count = countMapEo.get(playerName) ?? 0;
              countMapEo.set(playerName, count + 1);
            }
          });

          processedPlayers[playerEntryId] = true;
          playersProcessed++;

          if (playersProcessed >= maxRank) {
            break;
          }
        }

        page++;
      }

      const countArrayCaptaincy = Array.from(countMapCaptaincy.entries()).map(([name, count]) => ({ name, count }));
      const countArrayEo = Array.from(countMapEo.entries()).map(([name, count]) => ({ name, count }));
      
      return {countArrayCaptaincy, countArrayEo, currentGameweek};
    }


export default async function Captaincy(){

    const data = await getCaptaincy();

    const totalCaptains = data.countArrayCaptaincy.reduce((total, player) => total + player.count, 0);
  
    const playersNewData = data.countArrayCaptaincy.map(player => {
        const percentage = player.count / totalCaptains * 100;
        return {
          ...player,
          count: percentage.toFixed(2)
        };
      });
    
    playersNewData?.sort((a, b) => b.count - a.count);

    const playerCounts = [];

data.countArrayEo.forEach((player) => {
    const playerDataIndex = data.countArrayCaptaincy.findIndex(
      (data) => data.name === player.name
    );
  
    if (playerDataIndex !== -1) {
      const captaincyCount = data.countArrayCaptaincy[playerDataIndex]?.count ?? 0;
      const combinedCount = ((player.count + captaincyCount) / 10000) * 100;
  
      playerCounts.push({
        name: player.name,
        count: combinedCount.toFixed(2),
      });
    }
  });
  

  playerCounts?.sort((a, b) => b.count - a.count);
  
  const currentGameweek = data?.currentGameweek;
  const topPlayers = playersNewData?.slice(0, 7);
  const topEO = playerCounts?.slice(0, 7);

  return (
        <DisplayCaptaincy captaincy={topPlayers} eo={topEO} gameweek={currentGameweek}/>
  );
}