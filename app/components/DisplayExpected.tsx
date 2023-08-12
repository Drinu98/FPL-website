'use client'

import React, { useState, useEffect } from 'react';

type Player = {
    name: string
    team: string
    teamLong: string
    position_short: string
    position: string
    xG: string
    xGA: string
    xGI: string
}

type ExpectedProps = {
  currentGameweekXG: Array<Player>
  xGTotalLast4Gameweeks: Array<Player>
  xGTotal: Array<Player>
}

type DisplayGamweeksType = 'currentGameweekXG' | 'xGTotalLast4Gameweeks' | 'xGTotal'

function Expected(props: ExpectedProps) {
    const {currentGameweekXG, xGTotalLast4Gameweeks, xGTotal} = props
    const [selectedData, setSelectedData] = useState(currentGameweekXG);
    const [selectedFilter, setSelectedFilter] = useState<string>("");
    const [sortedAndFilteredData, setSortedAndFilteredData] = useState<Player[]>([]);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    const positions = Array.from(new Set(currentGameweekXG.map((player) => player.position)));
    const teams = Array.from(new Set(currentGameweekXG.map((player) => player.teamLong)));
    
    const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedFilter = event.target.value;
      setSelectedFilter(selectedFilter);
    };
  // const handleDataSelect = (event: React.FormEvent<HTMLSelectElement>) => {
  //   const value = event.currentTarget.value;
  //   switch(value) {
  //     case 'currentGameweekXG':
  //       setSelectedData(currentGameweekXG);
  //       break;
  //     case 'xGTotalLast4Gameweeks':
  //       setSelectedData(xGTotalLast4Gameweeks);
  //       break;
  //     case 'xGTotal':
  //       setSelectedData(xGTotal);
  //       break; 
  //     default:
  //       setSelectedData(currentGameweekXG);
  //       break;
  //   }
  // }

const handleDataSelect = (event: React.FormEvent<HTMLSelectElement>) => {
  const value = event.currentTarget.value;

  let selectedData: Player[] = [];
  switch (value) {
    case 'currentGameweekXG':
      selectedData = currentGameweekXG;
      break;
    case 'xGTotalLast4Gameweeks':
      selectedData = xGTotalLast4Gameweeks;
      break;
    case 'xGTotal':
      selectedData = xGTotal;
      break;
    default:
      selectedData = currentGameweekXG;
      break;
  }

  // Sort the data in descending order based on xGI
  const sortedData = selectedData.sort((a, b) => parseFloat(b.xGI) - parseFloat(a.xGI));

  // Splice the list to show only the top 15 players
  const slicedData = sortedData.slice(0, 15);

  // Apply the selected filter if it is set
  let filteredData: Player[] = [];
  if (selectedFilter) {
    filteredData = slicedData.filter(
      (player) => player.position === selectedFilter || player.teamLong === selectedFilter
    );
  } else {
    filteredData = slicedData;
  }

  setSortedAndFilteredData(filteredData);
};


  const handleSortClick = (columnName : any) => {
    // Sort the selectedData array by the given column name
    const sortedData = sortedAndFilteredData.sort((a : any, b : any) => {
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
      <select
            value={selectedFilter}
            onChange={handleFilterSelect}
            className="expected-select-teams  select"
          >
            <option value="">All Players</option>
            <optgroup label="Positions">
              {positions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </optgroup>
            <optgroup label="Teams">
              {teams.map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
            </optgroup>
          </select>
      <select className='expected-select select' onChange={handleDataSelect} value={selectedData === currentGameweekXG ? 'currentGameweekXG' : selectedData === xGTotalLast4Gameweeks ? 'xGTotalLast4Gameweeks' : 'xGTotal'}>
          <option value="currentGameweekXG">Current Gameweek</option>
          <option value="xGTotalLast4Gameweeks">Last 4 GWs</option>
          <option value="xGTotal">Last 6 GWs</option>
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
              {sortedAndFilteredData.map((gwObj, index) => (
                <tr key={index} className="table-row">
                  <td></td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.name}
                  </td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.team}</td>
                  <td className="player-info" style={{textAlign: 'left'}}>{gwObj.position_short}</td>
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
