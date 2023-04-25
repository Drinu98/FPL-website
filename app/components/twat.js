import Image from 'next/image'

async function getTwat() {
    const leagueId = 314; // Change league ID to your league ID
    const maxRank = 10000; // Change max number of players to retrieve


    const processedPlayers = {};
    const results = [];

    let totalPages = 202; // Change to the total number of pages to fetch
    let page = 1;
    let playersProcessed = 0;

    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');

    const data = await response.json();

    const currentGameweekData = data.events?.find(event => event?.is_current === true);

    const currentGameweek = currentGameweekData?.id;

    while (page <= totalPages && playersProcessed < maxRank) {
        const res = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`,
        {
          next: {
            revalidate: 1
          },
        },
      );

         // Recommendation: handle errors
        if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data');
        } 
        
        const data = await res.json();

        const standings = data?.standings;

        if (standings?.results.length === 0) {
            totalPages = page - 1;
            break;
        }

        for (const playerEntry of standings?.results) {
            const playerEntryId = playerEntry.entry;
            if (processedPlayers[playerEntryId]) {
              continue;
            }
  
            const entry = playerEntry.entry || 0;
            const playerName = playerEntry.player_name || '';
            const entryName = playerEntry.entry_name || '';
            const eventTotal = playerEntry.event_total || 0;
            const rank = playerEntry.rank || 0;
            const lastRank = playerEntry.last_rank || 0;
            
            results.push({ entry, player_name: playerName, entry_name: entryName, total: eventTotal, rank: rank, lastRank: lastRank, link: `https://fantasy.premierleague.com/entry/${entry}/event/${currentGameweek}` });
  
            results.sort((a, b) => a.total - b.total);
  
            processedPlayers[playerEntryId] = true;
            playersProcessed++;
        
            if (playersProcessed >= maxRank) {
              break;
            }
          }

          page++;
        
    }

    return results;
  }


  export default async function Page(){
    const data = await getTwat();

    return (
      <>
        <div>
          {data?.length > 0 && (
            <div className='twat-box'>
              <p className='twat-text'>
                  {data[0]?.player_name}
              </p>
              <p style={{textAlign: 'center'}}>
                <a href={data[0]?.link} className='twat-text-link'>{data[0]?.entry_name}</a>
                  
              </p>
              <p className='twat-text'>
                {data[0]?.total} Points
              </p>
              <p className='twat-text'>
                {data[0]?.lastRank} <Image  
                                      src='/images/redarrow.png' 
                                      height={20}
                                      width= {20} 
                                      alt='➡'
                                      style={{marginBottom: 4}}
                                      /> {data[0]?.rank}
                </p>
              
            </div>
          )}
        </div>
      </>
      );
  }