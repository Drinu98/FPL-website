'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'

function Injuries() {
  const [data, setData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('Arsenal');

  const handleTeamSelect = (event) => {
    setSelectedTeam(event.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/injuries', {
        next: {
          revalidate: 300
        },
      }
    );

      const data = await response.json();
      setData(data.groupedData);
    }
    fetchData();
  }, []);

  const filteredData = {};

  for (const team in data) {
    const playersWithIAndDStatus = data[team].filter(player => player.status === 'i' || player.status === 'd');
    const sortedPlayers = playersWithIAndDStatus.sort((a, b) => {
      return new Date(b.newsAdded) - new Date(a.newsAdded);
    });
  
    filteredData[team] = sortedPlayers;
  }
  
  const renderPlayers = () => {
    if (selectedTeam === '') {
      return <p>Please select a team</p>;
    }

    const playersForSelectedTeam = selectedTeam ? filteredData[selectedTeam] || [] : [];
    if (playersForSelectedTeam.length === 0) {
      return <p>No players injured found for the selected team</p>;
    }

    return (
    <table style={{width: '100%'}}>
    <thead>
        <tr>
        <th className="transfer-header"></th>
        <th className="transfer-header"></th>
        <th className="transfer-header"></th>
        <th className="transfer-header">Name</th>
        <th className="transfer-header"></th>
        <th className="transfer-header">Status</th>
          </tr>
        </thead>
        <tbody>
          {playersForSelectedTeam?.map((player, index) => (
            <tr key={index} className="table-row">
                <td style={{paddingRight: '10px', paddingLeft: '10px'}}>
                    {player.status === 'i' ? (
                    <Image src='/images/redflag.png' alt="Red Flag" width={22} height={22} /> /* Display red flag for status 'i' */
                    ) : player.chanceOfPlaying && parseInt(player.chanceOfPlaying) > 50 ? (
                    <Image src='/images/yellowflag.png' alt="Yellow Flag" width={22} height={22} /> /* Display yellow flag for chanceOfPlaying > 50 */
                    ) : player.chanceOfPlaying && parseInt(player.chanceOfPlaying) <= 50 ? (
                    <Image src='/images/orangeflag.png' alt="Orange Flag" width={22} height={22} /> /* Display orange flag for chanceOfPlaying <= 50 */
                    ) : null}
                </td>
                <td><Image className="player-photo" src={player.photo} alt={player.web_name} width={65} height={80}/></td> 
                <td></td>
                <td className="player-info">
                  <div style={{textAlign: 'left'}}>{player.web_name}</div>
                  <div className='player-transfer-info-box' style={{textAlign: 'left'}}>
                    <span>
                      {player.teamShort}
                    </span>
                    <span className='transfers-team-box' style={{textAlign: 'left'}}>
                      {player.position}
                    </span> 
                  </div>
                </td>
                <td style={{paddingRight: '15px'}}></td>
                <td className="news-info" style={{textAlign: 'left'}}>{player.news}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
    <div className='transfers-container'>
        <div className='graphic-container'>
            <h2 className='transfers-title'>Injuries</h2>
        </div>
      <label>
        <select value={selectedTeam} onChange={handleTeamSelect} className='injury-select select'>
          {Object.keys(filteredData).map((team, index) => (
            <option key={index} value={team.Arsenal}>
              {team}
            </option>
          ))}
        </select>
      </label>
      <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
      {renderPlayers()}
      </div>
    </div>
    </>
  );
}

export default Injuries;
