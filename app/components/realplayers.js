import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

async function getRealPlayers() {
    const players = 
    [
      {name: 'Aaron Ramsdale', id: 6462423},
      {name: 'Kieran Trippier', id: 5733385},
      {name: 'James Maddison', id: 659844}, 
      {name: 'Jason Steele', id: 912952}, 
      {name: 'Hjalmar Ekdal', id: 116239}, 
      {name: 'Arijanet Muric', id: 7801056}, 
      {name: 'Jack Cork', id: 2378857}, 
      {name: 'Josh Brownhill', id: 5675578}, 
      {name: 'Matt Targett', id: 2926894}, 
      {name: 'John McGinn', id: 5318110}, 
      {name: 'Charlie Taylor', id: 6046112}, 
      {name: 'Harvey Barnes', id: 6055592}, 
      {name: 'Sean Longstaff', id: 5000155}, 
      {name: 'Matt Targett', id: 2926894}, 
      {name: 'Rob Holding', id: 6329781}, 
      {name: 'Fabian Schär', id: 6123705}, 
      {name: 'Anthony Gordon', id: 8066182}, 
      // {name: 'Matt Turner', id: 6555943}, 
      // {name: 'Luke Ayling', id: 6567765}
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
      const { summary_event_points, name, summary_overall_points } = playerData;
      const result = { name: player.name, points: summary_event_points, team: name, overall: summary_overall_points, link: `https://fantasy.premierleague.com/entry/${player.id}/event/${currentGameweek}` };

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
    
  return (
    <>
    <div className='realplayers-container'>
      <div className='graphic-container'>
        <h2 className='transfers-title'>Player Transfers</h2>
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <table className="transfers-table-realplayers">
          <thead>
            <tr>
              <th className="transfer-header">Name</th>
              <th className="transfer-header">Points</th>
              <th className="transfer-header">Overall</th>
              <th className="transfer-header">Transfers</th>
              <th className="transfer-header">Link</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((player, index) => (
              <tr key={index} className="table-row">
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
                  <a href={player.link}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </a>
                </td>
              </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
        
);
  }