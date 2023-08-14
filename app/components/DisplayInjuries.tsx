'use client'

import React, { useState } from 'react';
import Image from 'next/image'

type Player =  {
  web_name: string
  status: string
  news: string
  photo: string
  position: string
  teamShort: string
  teamLong: string
  chanceOfPlaying: number
  newsAdded: string
}


type InjuriesProps = {
  // injuries: Array<any>
  injuries: Record<string, Array<Player>>
}

function Injuries(props: InjuriesProps) {
  const {injuries} = props
  // const [data, setData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All Players');

  const handleTeamSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedTeam(event.currentTarget.value);
  }

  const filteredData = [] as Array<any>;

  for (const team in injuries) {
    const playersWithIAndDStatus = injuries[team].filter((player: any) => player.status === 'i' || player.status === 'd');
    const sortedPlayers = playersWithIAndDStatus.sort((a: any, b: any) => {
      return new Date(b.newsAdded).getTime() - new Date(a.newsAdded).getTime();
    });
  
    filteredData[team as typeof filteredData[number]] = sortedPlayers;
  }
  
  const renderPlayers = () => {
    const allPlayers = Object.values(filteredData).flat();

    if (selectedTeam === '') {
      return <p>Please select a team</p>;
    }

    // const playersForSelectedTeam = (selectedTeam ? filteredData[selectedTeam as typeof filteredData[number]] || [] : []) as Array<any>;
    const playersForSelectedTeam = selectedTeam === 'All Players'
    ? allPlayers
    : (filteredData[selectedTeam as typeof filteredData[number]] || []);

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
          {playersForSelectedTeam?.map((player: any, index: any) => (
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
        {/* <select value={selectedTeam} onChange={handleTeamSelect} className='injury-select select'>
          {Object.keys(filteredData).map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select> */}
        <select value={selectedTeam} onChange={handleTeamSelect} className='injury-select select'>
          <option value="All Players">All Players</option> {/* Add the "All Players" option */}
          {Object.keys(filteredData).map((team, index) => (
            <option key={index} value={team}>
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
