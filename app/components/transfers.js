'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'

function Transfers() {
  const [data, setData] = useState([]);
  const [showTransfers, setTransfers] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/transfers', {
        next: {
          revalidate: 300
        },
      }
    );

      const data = await response.json();
      setData(data.currentGameweekData);
    }
    fetchData();
  }, []);

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
    <div>
      <div className="text-center captaincy-button-box">
        <button onClick={() => handleToggle(false)} className="captaincy-button">In</button>
        <button onClick={() => handleToggle(true)} className="captaincy-button">Out</button>
      </div>
      <table className="transfers-table">
        <thead>
          <tr>
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
              <td><img className="player-photo" src={player.photo} alt={player.web_name} /></td>
              <td className="player-info">
                <div>{player.web_name}</div>
                <div className='player-transfer-info-box'>
                  <span>
                    {player.team}
                  </span>
                  <span className='transfers-team-box'>
                    {player.position}
                  </span> 
                </div>
              </td>
              <td className="player-info">{player.cost}</td>
              <td className="player-info">{player.selected_by_percent}%</td>
              <td className="player-info">{player.total_points}</td>
              <td className="player-info">{player.transfers_in}</td>
            </tr>
          )) 
          : topPlayersOut?.map((player, index) => (
            <tr key={index} className="table-row">
              <td><img className="player-photo" src={player.photo} alt={player.web_name} /></td>
              <td className="player-info">
                <div>{player.web_name}</div>
                <div className='player-transfer-info-box'>
                  <span>
                    {player.team}
                  </span>
                  <span className='transfers-team-box'>
                    {player.position}
                  </span> 
                </div>
              </td>
              <td className="player-info">{player.cost}</td>
              <td className="player-info">{player.selected_by_percent}%</td>
              <td className="player-info">{player.total_points}</td>
              <td className="player-info">{player.transfers_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}

export default Transfers;
