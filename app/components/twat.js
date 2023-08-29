import Image from 'next/image'
import { prisma } from "../../services/prisma";

async function getTwat() {
  try{

    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
      next: {
        revalidate: 500
      },
    });

    const data = await response.json();

    const currentGameweek = data.events?.find(event => event.is_current === true)?.id;

    const top10kplayers = await prisma.top10kPlayersChange.findMany({});

    top10kplayers.sort((a, b) => a.eventTotal - b.eventTotal);

    const spliceTop10kPlayers = top10kplayers.splice(0, 1);

    return {spliceTop10kPlayers, currentGameweek};
  }catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
   
  }

  export default async function Twat(){
    try{
      const data = await getTwat();

      const twat = data.spliceTop10kPlayers;
      const currentGameweek = data.currentGameweek;

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
                    {twat[0]?.playerName} 
                </p>
                <p style={{textAlign: 'center'}}>
                <a
                  target="_blank"
                  href={`https://fantasy.premierleague.com/entry/${twat[0]?.entry}/event/${currentGameweek}`}
                  className='twat-text-link'
                  rel="noopener noreferrer"
                >
                  {twat[0]?.entryName}
                </a>
                    
                </p>
                <p className='twat-text'>
                  {twat[0]?.eventTotal} Points
                </p>
                <p className='twat-text'>
                  {twat[0]?.lastRank} <Image  
                                        src='/images/redarrowdark.png' 
                                        height={20}
                                        width= {20} 
                                        alt='➡'
                                        style={{marginBottom: 4}}
                                        /> {twat[0]?.currentRank.toLocaleString()}
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