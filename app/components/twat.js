import Image from 'next/image'

async function getTwat() {
  try{
    const leagueId = 314; // Change league ID to your league ID
    const maxRank = 13000; // Change max number of players to retrieve


    const processedPlayers = {};
    const results = [];

    let totalPages = 210; // Change to the total number of pages to fetch
    let page = 1;
    let playersProcessed = 0;

    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
      next: {
        revalidate: 400
      },
    });

    const data = await response.json();

    // const currentGameweekData = data.events?.find(event => event?.is_current === true);

    const currentGameweek = data.events?.find(event => event.is_current === true)?.id ?? data.events?.find(event => event.is_next === true)?.id;


    while (page <= totalPages && playersProcessed < maxRank) {
        const res = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings?page_standings=${page}`,
        {
          next: {
            revalidate: 400
          },
        },
      );
        
        const data = await res.json();

        
         // Recommendation: handle errors
        //  if (!data.ok) {
        //   // This will activate the closest `error.js` Error Boundary
        //       throw new Error('Failed to fetch data');
        //   } 

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
  }catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
   
  }

  export default async function Twat(){
    try{
      const data = await getTwat();

      if (!data || data.length === 0) {
        // Display loading message while fetching data
        return (
          <>
          <div className="fixture-container">
            <div className='graphic-container'>
              <h2 className='transfers-title'>Disaster of the Week</h2>          
            </div>
            <p className='error-message-twat'>
              <Image
                src='/images/errorlogo.png'
                alt='FPL Focal Logo'
                width={50}
                height={50}
                className='error-logo'
              />
              The Game is Updating...
            </p>
          </div>
          </>
        );
      }

      return (
        <>
        <div className="fixture-container">
          <div className='graphic-container'>
            <h2 className='transfers-title'>Disaster of the Week</h2>
          </div>
          <div>
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
            
          </div>
        </div> 
        </>
        );
    }catch(error){
      console.error(error);
      return (
        <>
        <div className="fixture-container">
          <div className='graphic-container'>
            <h2 className='transfers-title'>Disaster of the Week</h2>          
          </div>
          <p className='error-message-twat'>
            <Image
              src='/images/errorlogo.png'
              alt='FPL Focal Logo'
              width={50}
              height={50}
              className='error-logo'
            />
            The Game is Updating...
          </p>
        </div>
        </>
      );
    }
  }