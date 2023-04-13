'use client'

import { useState, useEffect, useMemo } from 'react';

function Captaincy() {
  const [playerData, setPlayerData] = useState([]);
  const [playerEO, setPlayerEO] = useState([]);
  const [showCaptains, setShowCaptains] = useState(true);

useEffect(() => {
    async function fetchData() {
      try {
        const [captaincyResponse, eoResponse] = await Promise.all([
            fetch('/api/captaincy', 
            {
              cache: 'force-cache'
            },
          ),
            fetch('/api/eo', 
            {
              cache: 'force-cache'
            },
          )
        ]);

        const captaincyData = await captaincyResponse.json();
        const eoData = await eoResponse.json();
        
        setPlayerData(captaincyData.countArray);
        setPlayerEO(eoData.countArray);

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
}, []);


    const totalCaptains = playerData.reduce((total, player) => total + player.count, 0);
  
    const playersNewData = playerData.map(player => {
        const percentage = player.count / totalCaptains * 100;
        return {
          ...player,
          percentage: percentage.toFixed(2)
        };
      });
    
    playersNewData.sort((a, b) => b.count - a.count);

  const playerCounts = [];

  playerEO.forEach((player) => {
    const playerDataIndex = playerData.findIndex(
      (data) => data.name === player.name
    );

    if (playerDataIndex !== -1) {
      const combinedCount = ((player.count + playerData[playerDataIndex].count) / 10000) * 100;

      playerCounts.push({
        name: player.name,
        count: combinedCount.toFixed(2),
      });
    }
  });

  playerCounts.sort((a, b) => b.count - a.count);

  const topPlayers = useMemo(() => playersNewData?.slice(0, 7), [playersNewData]);
  const topEO = useMemo(() => playerCounts?.slice(0, 7), [playerCounts]);

  function handleToggle(showCaptains) {
    setShowCaptains(!showCaptains);
  }

  if (!playerData || !playerEO) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <div className="text-center captaincy-button-box">
        <button className="captaincy-button" onClick={() => handleToggle(false)}>
          Captains
        </button>
        <button className="captaincy-button" onClick={() => handleToggle(true)}>
          EO
        </button>
      </div>
        <table className="transfers-table-captaincy">
          <thead>
            <tr>
              <th className="transfer-header" >Name</th>
              <th className="transfer-header"></th>
              <th className="transfer-header" style={{textAlign: 'left'}}>{showCaptains ? 'Captaincy' : 'EO'}</th>
            </tr>
          </thead>
          <tbody className='table-body-captaincy'>
            {showCaptains
              ? topPlayers.map((player, index) => (
                  <tr key={index} className="table-row">
                    <td>{player.name}</td>
                    <td></td>
                    <td className='player-info-captaincy' style={{textAlign: 'left'}}>{player.percentage}%</td>
                  </tr>
                ))
              : topEO.map((player, index) => (
                  <tr key={index} className="table-row">
                    <td>{player.name}</td>
                    <td></td>
                    <td className='player-info-captaincy' style={{textAlign: 'left'}}>{player.count}%</td>
                  </tr>
                ))}
          </tbody>
        </table>
      
    </div>
  );
}

export default Captaincy;