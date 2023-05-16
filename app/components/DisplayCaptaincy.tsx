'use client'

import { useState} from 'react';

type Player = {
    name: string
    count: number
}


type DisplayCaptaincyProps = {
    captaincy: Array<Player>
    eo: Array<Player>
    gameweek: number
}

type DisplayPlayersType = 'captaincy' | 'eo'

function Captaincy(props: DisplayCaptaincyProps) {
  const {captaincy, eo, gameweek} = props

  const [showCaptains, setShowCaptains] = useState<DisplayPlayersType>('captaincy');


function toggleDisplayPlayers(nextDisplayType : DisplayPlayersType) {
    setShowCaptains(nextDisplayType);
  }
  
  const player = showCaptains === 'captaincy' ? captaincy : eo

  return (
    <div className='captaincy-container'>
      <div className='graphic-container'>
        <h2 className='transfers-title'>Top 10K</h2>                  
      </div>
      <div>
        <h2 className="deadline-date">Gameweek {gameweek}</h2>
      </div>
      <div style={{overflowX: 'hidden', overflowY: 'auto'}}>
        <div className="text-center captaincy-button-box">
          <button className="captaincy-button" onClick={() => setShowCaptains('captaincy')}>
            Captains
          </button>
          <button className="captaincy-button" onClick={() => setShowCaptains('eo')}>
            EO
          </button>
        </div>
        <table className="transfers-table-captaincy">
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header"></th>
              <th className="transfer-header" >Name</th>
              <th className="transfer-header" style={{textAlign: 'left'}}>{showCaptains ? 'Captaincy' : 'EO'}</th>
            </tr>
          </thead>
          <tbody className='table-body-captaincy'>
          {player.map((player, index) => (
                  <tr key={index} className="table-row">
                     <td></td>
                     <td></td>
                     <td>{player.name}</td>
                     <td className='player-info-captaincy' style={{textAlign: 'left'}}>{player.count}%</td>
                  </tr>
            ))}
            {/* {showCaptains
              ? captaincy.map((player, index) => (
                  <tr key={index} className="table-row">
                    <td></td>
                    <td></td>
                    <td>{player.name}</td>
                    <td className='player-info-captaincy' style={{textAlign: 'left'}}>{player.percentage}%</td>
                  </tr>
                ))
              : eo.map((player, index) => (
                  <tr key={index} className="table-row">
                    <td></td>
                    <td></td>
                    <td>{player.name}</td>
                    <td className='player-info-captaincy' style={{textAlign: 'left'}}>{player.count}%</td>
                  </tr>
                ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Captaincy;