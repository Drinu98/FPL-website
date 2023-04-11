import Image from 'next/image'

async function getPriceChanges(){

  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
      {
        next: {
          revalidate: 86400
        },
      }
    );

    const data = await response.json();

    return data;
}


export default async function Page(){

  const data = await getPriceChanges();

  const players = data.elements;
  const teams = data.teams;

  const risers = players.filter((player) => player.cost_change_event > 0).map(player => {
    const team = teams.find(team => team.code === player.team_code);

    return {
      web_name: player.web_name,
      cost: (player.now_cost / 10).toFixed(1),
      team: team ? team.short_name : ''
    };
  });

  const fallers = players.filter((player) => player.cost_change_event_fall > 0).map(player => {
    const team = teams.find(team => team.code === player.team_code);

    return {
      web_name: player.web_name,
      cost: (player.now_cost / 10).toFixed(1),
      team: team ? team.short_name : ''
    };
  });


  return (
    <>
    <div className='pricechanges-container'>
      <div className='graphic-container'>
        <h2 className='transfers-title'>Price Changes</h2>
      </div>
    <div style={{display: 'flex', marginTop: 5}}>
      <div style={{ flex: 1 }}>
        <table style={{ width: '100%', marginLeft: 5 }} className="transfers-table-playerchanges">
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header" >Name</th>
              <th className="transfer-header"></th>
              <th className="transfer-header" style={{textAlign: 'left'}}>Team</th>
              <th className="transfer-header" style={{textAlign: 'left'}}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {risers.map((player, index) => (
              <tr key={index} className="table-row">
                <td style={{paddingRight: '0px'}} className='arrow-box'><Image alt='greenarrow up' src={'/images/greenarrowup.png'} width={15} height={15} className='greenarrowup'></Image></td>
                <td>{player.web_name}</td>
                <td></td>
                <td style={{textAlign: 'left'}}>{player.team}</td>
                <td style={{textAlign: 'left'}}>{player.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ flex: 1, borderLeft: '1px solid rgba(55, 0, 60, 0.08)', paddingRight: 5}}>
        <table style={{ width: '100%' }} className="transfers-table-playerchanges">
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header">Name</th>
              <th className="transfer-header"></th>
              <th className="transfer-header" style={{textAlign: 'left'}}>Team</th>
              <th className="transfer-header" style={{textAlign: 'left'}}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {fallers.map((player, index) => (
              <tr key={index} className="table-row">
                <td style={{paddingRight: '0px'}} className='arrow-box'><Image alt='greenarrow up' src={'/images/redarrow.png'} width={15} height={15} className='redarrowdown' ></Image></td>
                <td>{player.web_name}</td>
                <td></td>
                <td style={{textAlign: 'left'}}>{player.team}</td>
                <td style={{textAlign: 'left'}}>{player.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
</div>

    </>
  );

}




