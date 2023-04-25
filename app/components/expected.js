'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'

function Expected() {
const [expectedGoalsCurrentGameweek, setExpectedGoalsCurrentGameweek] = useState([]);
const [expectedGoalsLast4, setExpectedGoalsLast4] = useState([]);
const [expectedGoalsLast6, setExpectedGoalsLast6] = useState([]);
const [selectedData, setSelectedData] = useState(expectedGoalsCurrentGameweek);
const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/expected', {
        next: {
          revalidate: 60
        },
      }
    );

      const data = await response.json();


        // Sort the array of objects for each gameweek by xGI (descending) and get the top 10
      const expectedGoalsCurrentWeek = data?.currentGameweekXG?.sort((a, b) => b.xGI - a.xGI);
      const finalexpectedGoalsCurrentGameweek = expectedGoalsCurrentWeek.splice(0, 15);

      const sortedExpectedGoalsLast4 = Object.values(data.xGTotalLast4Gameweeks).sort((a, b) => parseFloat(b.xGI) - parseFloat(a.xGI));
      const sortedExpectedGoalsLast6 = Object.values(data.xGTotal).sort((a, b) => parseFloat(b.xGI) - parseFloat(a.xGI));
  
      const splicedExpectedGoalsLast4 = sortedExpectedGoalsLast4.splice(0, 15);
      const splicedExpectedGoalsLast6 = sortedExpectedGoalsLast6.splice(0, 15);
      
      setExpectedGoalsCurrentGameweek(finalexpectedGoalsCurrentGameweek);
      setExpectedGoalsLast4(splicedExpectedGoalsLast4);
      setExpectedGoalsLast6(splicedExpectedGoalsLast6);
      setSelectedData(finalexpectedGoalsCurrentGameweek);
    }
    fetchData();
  }, []);

  const handleDataSelect = (event) => {
    const value = event.target.value;
  
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

  const handleSortClick = (columnName) => {
    // Sort the selectedData array by the given column name
    const sortedData = selectedData.sort((a, b) => {
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
                <th className='transfer-header'>
                  xA
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
                  {/* <Image className="player-photo" src={gwObj.photo} alt={gwObj.name} width={65} height={80}/> */}
                  </td>
                {/* <td className="player-info">
                  <div style={{textAlign: 'left'}}>{gwObj.name}</div>
                  <div className='player-transfer-info-box' style={{textAlign: 'left'}}>
                    <span>
                      {gwObj.team}
                    </span>
                    <span className='transfers-team-box' style={{textAlign: 'left'}}>
                      {gwObj.position}
                    </span> 
                  </div>
                </td> */}
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
