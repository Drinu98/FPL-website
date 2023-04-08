'use client'

import React, { useState, useEffect } from 'react';


function PlayerList() {
  const [risers, setRisers] = useState([]);
  const [fallers, setFallers] = useState([]);
  const [showRisers, setShowRisers] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3000/api/playerchanges', 
      {
        next: {
          revalidate: 86400
        },
      }
    );
      const data = await response.json();

      // console.log(data.players);
      setRisers(data.players);
      setFallers(data.players);
    }
    fetchData();
  }, []);

  const rising = risers?.filter((player) => player.cost_change_event > 0).map((player) => ({ name: player.web_name, cost: (player.now_cost / 10).toFixed(1), rise: '+ 0.1'}));
  const falling = fallers?.filter((player) => player.cost_change_event_fall > 0).map((player) => ({ name: player.web_name, cost: (player.now_cost / 10).toFixed(1), fall: '- 0.1'}));

  const handleShowRisers = () => {
    setShowRisers(true);
  };

  const handleShowFallers = () => {
    setShowRisers(false);
  };

  return (
    <div>
      <div className="text-center captaincy-button-box">
        <button onClick={handleShowRisers} className="captaincy-button">Risers</button>
        <button onClick={handleShowFallers} className="captaincy-button">Fallers</button>
      </div>
      <table className="transfers-table">
        <thead>
          <tr>
            <th className="transfer-header">Name</th>
            <th className="transfer-header">Cost</th>
            <th className="transfer-header">Change</th>
          </tr>
        </thead>
        <tbody className="transfers-body">
          {showRisers &&
            rising?.map((player, index) => (
              <tr key={index} className="table-row">
                <td>{player.name}</td>
                <td>{player.cost}</td>
                <td style={{ color: 'green' }}>{player.rise}</td>
              </tr>
            ))}
          {!showRisers &&
            falling?.map((player, index) => (
              <tr key={index} className="table-row">
                <td>{player.name}</td>
                <td>{player.cost}</td>
                <td style={{ color: 'red' }}>{player.fall}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}


export default PlayerList;









// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function PriceChanges() {
//   const [changedPlayers, setChangedPlayers] = useState([]);

//   useEffect(() => {
//     let intervalId;

//     async function fetchPlayerData() {
//       try {
//         const response = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/');
//         const data = response.data;
//         return data;
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     async function checkForPriceChanges() {
//       const initialData = await fetchPlayerData();
//       const initialPlayers = initialData.elements;

//       intervalId = setInterval(async () => {
//         const updatedData = await fetchPlayerData();
//         const updatedPlayers = updatedData.elements;

//         const changedPlayers = updatedPlayers.filter((player) => {
//           const initialPlayer = initialPlayers.find((p) => p.id === player.id);
//           return initialPlayer.now_cost !== player.now_cost;
//         });

//         setChangedPlayers(changedPlayers);

//         // Update initialPlayers to use in the next iteration
//         initialPlayers = updatedPlayers;
//       }, 86400000); // Check once per day (24 hours)
//     }

//     checkForPriceChanges();

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Changed players:</h1>
//       <ul>
//         {changedPlayers.map((player) => (
//           <li key={player.id}>{player.web_name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
