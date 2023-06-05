'use client'

import React, { useState } from 'react';

type Player = {
    name: string
    team: string
    position: string
    xG: string
    xGA: string
    xGI: string
}

type ExpectedProps = {
    expectedGoalsCurrentGameweek: Array<Player>
    expectedGoalsLast4: Array<Player>
    expectedGoalsLast6: Array<Player>
    groupedDataCurrent: Array<Player>
    groupedDataLast4: Array<Player>
    groupedDataLast6: Array<Player>
}

function Expected(props: ExpectedProps) {
    const {expectedGoalsCurrentGameweek, expectedGoalsLast4, expectedGoalsLast6, groupedDataCurrent, groupedDataLast4, groupedDataLast6} = props
    const [selectedData, setSelectedData] = useState(expectedGoalsCurrentGameweek);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'



  const handleDataSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const selectedPlayers = groupedDataCurrent[selectedTeam as keyof typeof groupedDataCurrent] || [];
    switch(value) {
      case 'currentGameweekXG':
        setSelectedData(expectedGoalsCurrentGameweek);
        break;
      case 'xGTotalLast4Gameweeks':
        setSelectedData(expectedGoalsLast4);
        break;
      case 'xGTotal':
        setSelectedData(expectedGoalsLast6);
        break; 
      default:
        setSelectedData(expectedGoalsCurrentGameweek);
        break;
    }
  }

  const handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedTeam(event.currentTarget.value);
  };

  const players = groupedDataCurrent[selectedTeam as any] || [];

  const handleSortClick = (columnName : any) => {
    // Sort the selectedData array by the given column name
    const sortedData = selectedData.sort((a : any, b : any) => {
      if (sortOrder === 'asc') {
        return a[columnName] - b[columnName];
      } else {
        return b[columnName] - a[columnName];
      }
    });

    setSelectedData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
    <div className='transfers-container'>
        <div className='graphic-container'>
            <h2 className='transfers-title'>Expected Data</h2>
        </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
      <select className='expected-select select' onChange={handleDataSelect} value={selectedData === expectedGoalsCurrentGameweek ? 'currentGameweekXG' : selectedData === expectedGoalsLast4 ? 'xGTotalLast4Gameweeks' : 'xGTotal'}>
          <option value="currentGameweekXG">Current Gameweek</option>
          <option value="xGTotalLast4Gameweeks">Last 4 GWs</option>
          <option value="xGTotal">Last 6 GWs</option>
      </select>
      <select value={selectedTeam} onChange={handleSelectChange} className='expected-select select'>
        <option value="">Select a team</option>
        {Object.keys(groupedDataCurrent).map((teamLong) => (
          <option key={teamLong} value={teamLong}>
            {teamLong}
          </option>
        ))}
      </select>
        <div>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                <th className='transfer-header'></th>
                <th className='transfer-header'>
                  Name
                </th>
                <th className='transfer-header'>
                  Team
                </th>
                <th className='transfer-header'>
                  Position
                </th>
                <th className='transfer-header' onClick={() => handleSortClick('xG')}>
                  xG {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th className='transfer-header' onClick={() => handleSortClick('xGA')}>
                  xA {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th className='transfer-header' onClick={() => handleSortClick('xGI')}>
                  xGI {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedData.map((gwObj, index) => (
                <tr key={index} className="table-row">
                  <td></td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.name}
                  </td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.team}</td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.position}</td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.xG}</td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.xGA}</td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.xGI}</td>
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

export default Expected;
