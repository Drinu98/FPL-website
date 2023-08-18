import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Image from "next/image"

async function getRealPlayers() {
    const players = 
    [
      {name: 'Aaron Ramsdale', id: 6462423, pic: '/images/arsenalgk.png'},
      {name: 'Kieran Trippier', id: 5733385, pic: '/images/newcastle.png'},
      {name: 'James Maddison', id: 659844, pic: '/images/spurs.png'}, 
      {name: 'Jason Steele', id: 912952, pic: '/images/brightongk.png'}, 
      {name: 'Hjalmar Ekdal', id: 116239, pic: '/images/burnley.png'}, 
      {name: 'Arijanet Muric', id: 7801056, pic: '/images/burnley.png'}, 
      {name: 'Jack Cork', id: 2378857, pic: '/images/burnley.png'}, 
      {name: 'Josh Brownhill', id: 5675578, pic: '/images/burnley.png'}, 
      {name: 'Matt Targett', id: 2926894, pic: '/images/newcastle.png'}, 
      {name: 'John McGinn', id: 5318110, pic: '/images/astonvilla.png'}, 
      {name: 'Charlie Taylor', id: 6046112, pic: '/images/burnley.png'}, 
      {name: 'Harvey Barnes', id: 6055592, pic: '/images/newcastle.png'}, 
      {name: 'Sean Longstaff', id: 5000155, pic: '/images/newcastle.png'}, 
      {name: 'Antoine Semenyo', id: 7758622, pic: '/images/bournemouth.png'}, 
      {name: 'Rob Holding', id: 6329781, pic: '/images/arsenal.png'}, 
      {name: 'Fabian Schär', id: 6123705, pic: '/images/newcastle.png'}, 
      {name: 'Anthony Gordon', id: 8066182, pic: '/images/newcastle.png'}, 
      {name: 'Chris Mepham', id: 4827843, pic: '/images/bournemouth.png'}, 
      {name: 'David Brooks', id: 2300682, pic: '/images/bournemouth.png'},
      {name: 'Mark Travers', id: 6481432, pic: '/images/bournemouthgk.png'},
      {name: 'Jaidon Anthony', id: 2962034, pic: '/images/bournemouth.png'},
      {name: 'Marcus Tavernier', id: 6201184, pic: '/images/bournemouth.png'},
      {name: 'Milos Kerkez', id: 7725278, pic: '/images/bournemouth.png'},
      {name: 'Tom Lockyer', id: 6965109, pic: '/images/luton.png'},
      {name: 'Manor Solomon', id: 7740301, pic: '/images/spurs.png'},
      {name: 'Conor Coady', id: 2106367, pic: '/images/leicster.png'},
      {name: 'James Justin', id: 3672414, pic: '/images/leicster.png'},
      {name: 'Ben Foster', id: 3471276, pic: '/images/wrexham.png'},
      {name: 'Reece James', id: 4782960, pic: '/images/chelsea.png'},
      {name: "Dara O'Shea", id: 7063246, pic: '/images/burnley.png'},
      {name: 'Japhet Tanganga', id: 3948239, pic: '/images/spurs.png'},
      {name: 'Jordan Beyer', id: 6122005, pic: '/images/burnley.png'},
      {name: 'Johann Gudmundsson', id: 3758723, pic: '/images/burnley.png'},
      {name: 'Lawrence Vigouroux', id: 6129161, pic: '/images/burnleygk.png'},
      {name: 'Zeki Amdouni', id: 6126421, pic: '/images/burnley.png'},
      {name: 'Alfie Devine', id: 6196697, pic: '/images/spurs.png'},
      {name: 'Harvey White', id: 1690038, pic: '/images/spurs.png'},
      {name: 'Ashley Phillips', id: 2145123, pic: '/images/spurs.png'},
      {name: 'Chris Smalling', id: 6381366, pic: '/images/roma.png'},
    ];

    const results = [];

    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');

    const data = await res.json();

    const currentGameweekData = data.events?.find(event => event?.is_current === true);

    const currentGameweek = currentGameweekData?.id;
    const playerList = data.elements;

    for (const player of players) {
      const res = await fetch(`https://fantasy.premierleague.com/api/entry/${player.id}/`);
      const playerData = await res.json();
      const { summary_event_points, name, summary_overall_points, summary_overall_rank } = playerData;
      const result = { name: player.name, points: summary_event_points, team: name, overall: summary_overall_points, rank: summary_overall_rank, link: `https://fantasy.premierleague.com/entry/${player.id}/event/${currentGameweek}`, pic: player.pic };

      const res2 = await fetch(`https://fantasy.premierleague.com/api/entry/${player.id}/transfers/`);

      const playerTransfers = await res2.json();
      

      const transfers = [];

      for (let fixture of Object.values(playerTransfers)) {
        if (fixture.event === currentGameweek) {
          const elementIn = playerList.find(player => player.id === fixture.element_in);
          const elementOut = playerList.find(player => player.id === fixture.element_out);
          transfers.push({ in: elementIn?.web_name, out: elementOut?.web_name });
        }
      }
      
      result.transfers = transfers;
      results.push(result);
    }
    
    return results;
  }


export default async function RealPlayers(){
    const data = await getRealPlayers();

    data.sort((playerA, playerB) => playerB.overall - playerA.overall);
    
  return (
    <>
    <div className='realplayers-container'>
      <div className='graphic-container'>
        <h2 className='transfers-title'>Players League</h2>
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <table className="transfers-table-realplayers">
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header">Name</th>
              <th className="transfer-header">Points</th>
              <th className="transfer-header">Overall</th>
              <th className="transfer-header">Rank</th>
              <th className="transfer-header">Transfers</th>
              <th className="transfer-header">Link</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((player, index) => (
              <tr key={index} className="table-row">
                <td>
                  <div className='realplayer-name-box' style={{textAlign:'center'}}><Image src={player.pic} alt={player.name} width={38} height={47} className='realplayers2-kits'/></div>
                </td>
                <td>
                  <div className='realplayer-name-box'>{`${player.name}`}</div>
                    <div className='player-transfer-info-box'>
                      <span className='realplayer-name-box'>
                        {player.team}
                      </span>
                    </div>
                </td>
                <td className='realplayer-name-box'>{player.points}</td>
                <td className='realplayer-name-box'>{player.overall}</td>
                <td className='realplayer-name-box'>{player.rank}</td>
                <td>
                  {player?.transfers?.length > 0 ? (
                    <ul className='realplayers-transfer-list'>
                      {player?.transfers?.map((transfer, index) => (
                        <li key={index} style={{paddingTop: '10px'}}>
                          <span style={{color: 'red'}}>{transfer.out}</span> <img className='realplayers-greenarrow' src='/images/greenarrow.png' alt='➡'></img> <span style={{color: 'green'}}>{transfer.in}</span>
                        </li>
                      ))}
                    </ul>
                    ) : (
                    'No transfers'
                  )}
                </td>
                <td>
                  <a target="_blank" href={player.link} rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </a>
                </td>
              </tr>
                ))}
          </tbody>
        </table>

                    <p className='courtesy-text' style={{marginTop: '30px', textAlign:'center'}}>In collaboration with <a target="_blank" href={'https://fplbot.app/'} className='courtesy-link' rel="noopener noreferrer">fplbot</a></p>

      </div>
      
    </div>
    </>
        
);
  }