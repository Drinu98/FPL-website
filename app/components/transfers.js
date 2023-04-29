'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'

function Transfers() {
  const [data, setData] = useState([]);
  const [showTransfers, setTransfers] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    const response = await fetch('/api/transfers');

    const data = await response.json();
    setData(data.currentGameweekData);
  }

  // create an array sorted by transfers_in
const dataSortedByTransfersIn = [...data].sort((a, b) => b.transfers_in - a.transfers_in);

// create an array sorted by transfers_out
const dataSortedByTransfersOut = [...data].sort((a, b) => b.transfers_out - a.transfers_out);
        
    
  const topPlayersIn = dataSortedByTransfersIn.slice(0, 10);
  const topPlayersOut = dataSortedByTransfersOut.slice(0, 10);

  function handleToggle(showTransfers) {
    setTransfers(!showTransfers);
  }

  return (
    <>
    <div className='transfers-container'>
      <div className='graphic-container'>
        <h2 className='transfers-title'>Top 10 Transfers</h2>
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <div className="text-center captaincy-button-box">
          <button onClick={() => handleToggle(false)} className="transfers-button">In</button>
          <button onClick={() => handleToggle(true)} className="transfers-button">Out</button>
        </div>
      
        <table className="transfers-table">
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header"></th>
              <th className="transfer-header">Name</th>
              <th className="transfer-header">Cost</th>
              <th className="transfer-header">Selected</th>
              <th className="transfer-header">Points</th>
              <th className="transfer-header">Transfers</th>
            </tr>
          </thead>
          <tbody className="transfers-body">
            {showTransfers 
              ? topPlayersIn?.map((player, index) => (
              <tr key={index} className="table-row">
                <td><Image className="player-photo" src={player.photo} alt={player.web_name} width={65} height={80}/></td>
                <td></td>
                <td className="player-info">
                  <div style={{textAlign: 'left'}}>{player.web_name}</div>
                  <div className='player-transfer-info-box' style={{textAlign: 'left'}}>
                    <span>
                      {player.team}
                    </span>
                    <span className='transfers-team-box' style={{textAlign: 'left'}}>
                      {player.position}
                    </span> 
                  </div>
                </td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.cost}</td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.selected_by_percent}%</td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.total_points}</td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.transfers_in}</td>
              </tr>
            )) 
            : topPlayersOut?.map((player, index) => (
              <tr key={index} className="table-row">
                <td><Image className="player-photo" src={player.photo} alt={player.web_name} width={65} height={80}/></td>
                <td></td>
                <td className="player-info">
                  <div style={{textAlign: 'left'}}>{player.web_name}</div>
                  <div className='player-transfer-info-box' style={{textAlign: 'left'}}>
                    <span>
                      {player.team}
                    </span>
                    <span className='transfers-team-box' style={{textAlign: 'left'}}>
                      {player.position}
                    </span> 
                  </div>
                </td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.cost}</td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.selected_by_percent}%</td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.total_points}</td>
                <td className="player-info" style={{textAlign: 'left'}}>{player.transfers_out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Transfers;
