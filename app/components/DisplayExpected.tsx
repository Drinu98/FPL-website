// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { usePathname } from 'next/navigation';

// type Player = {
//   name: string;
//   team: string;
//   teamLong: string;
//   position_short: string;
//   position: string;
//   cost: string;
//   xG: string;
//   xGA: string;
//   xGI: string;
// };

// type ExpectedProps = {
//   currentGameweekXG: Array<Player>;
//   previousGameweekXG: Array<Player>;
//   xGTotalLast2Gameweeks: Array<Player>;
//   xGTotalLast3Gameweeks: Array<Player>;
//   xGTotalLast4Gameweeks: Array<Player>;
//   xGTotalLast5Gameweeks: Array<Player>;
//   xGTotalLast6Gameweeks: Array<Player>;
//   xGTotalLast7Gameweeks: Array<Player>;
//   xGTotal: Array<Player>;
// };

// // type DisplayGamweeksType = 'currentGameweekXG' | 'xGTotalLast4Gameweeks' | 'xGTotal'
// type DisplayGamweeksType =
//   | "currentGameweekXG"
//   | "xGTotalLast4Gameweeks"
//   | "xGTotal";

// function Expected(props: ExpectedProps) {
//   const { currentGameweekXG, previousGameweekXG, xGTotalLast2Gameweeks, xGTotalLast3Gameweeks, xGTotalLast4Gameweeks, xGTotalLast5Gameweeks, xGTotalLast6Gameweeks, xGTotalLast7Gameweeks, xGTotal } = props;
//   const [selectedData, setSelectedData] = useState(currentGameweekXG);
//   const [selectedFilter, setSelectedFilter] = useState<string>("");
//   const [sortedAndFilteredData, setSortedAndFilteredData] = useState<Player[]>(
//     []
//   );
//   const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

//   const positions = Array.from(
//     new Set(currentGameweekXG.map((player) => player.position))
//   );
//   const teams = Array.from(
//     new Set(currentGameweekXG.map((player) => player.teamLong))
//   );

//   teams.sort((a, b) => a.localeCompare(b));

//   const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedFilter = event.target.value;
//     setSelectedFilter(selectedFilter);
//   };

//   const trimData = (data: Player[]) => {
//     return data.slice(0, 30);
//   };

//   const handleDataSelect = (event: React.FormEvent<HTMLSelectElement>) => {
//     const value = event.currentTarget.value;
//     switch (value) {
//       case "currentGameweekXG":
//         setSelectedData(currentGameweekXG);
//         break;
//       case "previousGameweekXG":
//         setSelectedData(previousGameweekXG);
//         break;
//       case "xGTotalLast2Gameweeks":
//         setSelectedData(xGTotalLast2Gameweeks);
//         break;
//       case "xGTotalLast3Gameweeks":
//         setSelectedData(xGTotalLast3Gameweeks);
//         break;      
//       case "xGTotalLast4Gameweeks":
//         setSelectedData(xGTotalLast4Gameweeks);
//         break; 
//       // case "xGTotalLast5Gameweeks":
//       //   setSelectedData(xGTotalLast5Gameweeks);
//       //   break;
//       // case "xGTotalLast6Gameweeks":
//       //   setSelectedData(xGTotalLast6Gameweeks);
//       //   break;
//       // case "xGTotalLast7Gameweeks":
//       //   setSelectedData(xGTotalLast7Gameweeks);
//       //   break;      
//       case "xGTotal":
//         setSelectedData(xGTotal);
//         break;
//       default:
//         setSelectedData(currentGameweekXG);
//         break;
//     }
//   };

//   useEffect(() => {
//     // Filter the data based on selected position or team
//     let filteredData = selectedData;
//     if (selectedFilter) {
//       filteredData = filteredData.filter(
//         (player) =>
//           player.position === selectedFilter ||
//           player.teamLong === selectedFilter
//       );
//     }

//     // Sort the filtered data by descending xGI
//     filteredData.sort((a, b) => parseFloat(b.xGI) - parseFloat(a.xGI));

//     // Trim the sorted data to the top 30
//     const trimmedData = trimData(filteredData);
//     setSortedAndFilteredData(trimmedData);
//   }, [selectedData, selectedFilter]);

//   const handleSortClick = (columnName: any) => {
//     // Sort the selectedData array by the given column name
//     const sortedData = sortedAndFilteredData.sort((a: any, b: any) => {
//       if (sortOrder === "asc") {
//         return a[columnName] - b[columnName];
//       } else {
//         return b[columnName] - a[columnName];
//       }
//     });

//     setSortedAndFilteredData(sortedData);
//     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//   };

//   const router = usePathname();

//   return (
//     <>
//       <div className="transfers-container">
//         <div className="graphic-container">
//           <h2 className="transfers-title">Expected Data</h2>
//           {router ==='/' && (
//           <a href="/expected" className="expand-image-expected">
//               <Image
//                 alt="expand"
//                 src={"/images/expand.png"}
//                 width={20}
//                 height={20}    
//                 className="expand-image"
//               />
//             </a>
//           )}
//         </div>
//         <div style={{ overflowY: "auto", overflowX: "hidden" }}>
//           <select
//             value={selectedFilter}
//             onChange={handleFilterSelect}
//             className="expected-select-teams  select"
//           >
//             <option value="">All Players</option>
//             <optgroup label="Positions">
//               {positions.map((position, index) => (
//                 <option key={index} value={position}>
//                   {position}
//                 </option>
//               ))}
//             </optgroup>
//             <optgroup label="Teams">
//               {teams.map((team, index) => (
//                 <option key={index} value={team}>
//                   {team}
//                 </option>
//               ))}
//             </optgroup>
//           </select>
//           <select
//             className="expected-select select"
//             onChange={handleDataSelect}
//             value={
//               selectedData === currentGameweekXG
//                 ? "currentGameweekXG"
//                 : selectedData === previousGameweekXG
//                 ? "previousGameweekXG"
//                 : selectedData === xGTotalLast2Gameweeks
//                 ? "xGTotalLast2Gameweeks"
//                 : selectedData === xGTotalLast3Gameweeks
//                 ? "xGTotalLast3Gameweeks"
//                 : selectedData === xGTotalLast4Gameweeks
//                 ? "xGTotalLast4Gameweeks"
//                 // : selectedData === xGTotalLast5Gameweeks
//                 // ? "xGTotalLast5Gameweeks"
//                 // : selectedData === xGTotalLast6Gameweeks
//                 // ? "xGTotalLast6Gameweeks"
//                 // : selectedData === xGTotalLast7Gameweeks
//                 // ? "xGTotalLast7Gameweeks"
//                 : "xGTotal"
//             }
//           >
//             <option value="currentGameweekXG">Current Gameweek</option>
//             <option value="previousGameweekXG">Previous Gameweek</option>
//             <option value="xGTotalLast2Gameweeks">Last 2 GWs</option>
//             <option value="xGTotalLast3Gameweeks">Last 3 GWs</option>
//             <option value="xGTotalLast4Gameweeks">Last 4 GWs</option>
//             {/* <option value="xGTotalLast5Gameweeks">Last 5 GWs</option> */}
//             {/* <option value="xGTotalLast6Gameweeks">Last 6 GWs</option> */}
//             {/* <option value="xGTotalLast7Gameweeks">Last 7 GWs</option> */}
//             <option value="xGTotal">Total</option>
//           </select>
//           <div>
//             <table style={{ width: "100%" }}>
//               <thead>
//                 <tr>
//                   <th className="transfer-header"></th>
//                   <th className="transfer-header">Name</th>
//                   <th className="transfer-header">Team</th>
//                   <th className="transfer-header">Position</th>
//                   <th
//                     className="transfer-header"
//                     onClick={() => handleSortClick("cost")}
//                   >
//                     Cost {sortOrder === "asc" ? "▲" : "▼"}
//                   </th>
//                   <th
//                     className="transfer-header"
//                     onClick={() => handleSortClick("xG")}
//                   >
//                     xG {sortOrder === "asc" ? "▲" : "▼"}
//                   </th>
//                   <th
//                     className="transfer-header"
//                     onClick={() => handleSortClick("xGA")}
//                   >
//                     xA {sortOrder === "asc" ? "▲" : "▼"}
//                   </th>
//                   <th
//                     className="transfer-header"
//                     onClick={() => handleSortClick("xGI")}
//                   >
//                     xGI {sortOrder === "asc" ? "▲" : "▼"}
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sortedAndFilteredData.map((gwObj, index) => (
//                   <tr key={index} className="table-row">
//                     <td></td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.name}
//                     </td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.team}
//                     </td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.position_short}
//                     </td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.cost}
//                     </td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.xG}
//                     </td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.xGA}
//                     </td>
//                     <td className="player-info" style={{ textAlign: "left" }}>
//                       {gwObj.xGI}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Expected;

"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation';

type Player = {
  name: string;
  team: string;
  teamLong: string;
  position_short: string;
  position: string;
  cost: string;
  xG: string | number;
  xGA: string | number;
  xGI: string | number;
};

type ExpectedProps = {
  currentGameweekXG: Array<Player>;
  previousGameweekXG: Array<Player>;
  xGTotalLast2Gameweeks: Array<Player>;
  xGTotalLast3Gameweeks: Array<Player>;
  xGTotalLast4Gameweeks: Array<Player>;
  xGTotal: Array<Player>;
};

type SortableColumn = 'cost' | 'xG' | 'xGA' | 'xGI';

const DisplayExpected: React.FC<ExpectedProps> = (props) => {
  const [selectedData, setSelectedData] = useState<Player[]>(props.xGTotal);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<SortableColumn>('xGI');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const router = usePathname();

  const positions = useMemo(() => Array.from(new Set(props.xGTotal.map(player => player.position))), [props.currentGameweekXG]);
  const teams = useMemo(() => Array.from(new Set(props.xGTotal.map(player => player.teamLong))).sort(), [props.currentGameweekXG]);

  const handleFilterSelect = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.target.value);
  }, []);

  const handleDataSelect = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as keyof ExpectedProps;
    setSelectedData(props[value]);
  }, [props]);

  const handleSortClick = useCallback((columnName: SortableColumn) => {
    setSortColumn(columnName);
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const sortedAndFilteredData = useMemo(() => {
    let filteredData = selectedData;
    if (selectedFilter) {
      filteredData = filteredData.filter(player => 
        player.position === selectedFilter || player.teamLong === selectedFilter
      );
    }

    // Sort the entire filtered dataset
    const sortedData = filteredData.sort((a, b) => {
      const aValue = parseFloat(a[sortColumn] as string) || 0;
      const bValue = parseFloat(b[sortColumn] as string) || 0;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Then slice to get the top 30
    return sortedData.slice(0, 30);
  }, [selectedData, selectedFilter, sortColumn, sortOrder]);

  return (
    <div className="transfers-container">
      <div className="graphic-container">
        <h2 className="transfers-title">Expected Data</h2>
        {router === '/' && (
          <a href="/expected" className="expand-image-expected">
            <Image
              alt="expand"
              src="/images/expand.png"
              width={20}
              height={20}    
              className="expand-image"
            />
          </a>
        )}
      </div>
      <div style={{ overflowY: "auto", overflowX: "hidden" }}>
        <select
          value={selectedFilter}
          onChange={handleFilterSelect}
          className="expected-select-teams select"
        >
          <option value="">All Players</option>
          <optgroup label="Positions">
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </optgroup>
          <optgroup label="Teams">
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </optgroup>
        </select>
        <select
          className="expected-select select"
          onChange={handleDataSelect}
          value={Object.keys(props).find(key => props[key as keyof ExpectedProps] === selectedData)}
        >
          <option value="currentGameweekXG">Current Gameweek</option>
          <option value="previousGameweekXG">Previous Gameweek</option>
          <option value="xGTotalLast2Gameweeks">Last 2 GWs</option>
          <option value="xGTotalLast3Gameweeks">Last 3 GWs</option>
          <option value="xGTotalLast4Gameweeks">Last 4 GWs</option>
          <option value="xGTotal">Total</option>
        </select>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header">Name</th>
              <th className="transfer-header">Team</th>
              <th className="transfer-header">Position</th>
              {(['cost', 'xG', 'xGA', 'xGI'] as const).map(column => (
                <th
                  key={column}
                  className="transfer-header"
                  onClick={() => handleSortClick(column)}
                >
                  {column.toUpperCase()} 
                  {sortColumn === column ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((player, index) => (
              <tr key={index} className="table-row">
                <td></td>
                <td className="player-info" style={{ textAlign: "left" }}>{player.name}</td>
                <td className="player-info" style={{ textAlign: "left" }}>{player.team}</td>
                <td className="player-info" style={{ textAlign: "left" }}>{player.position_short}</td>
                <td className="player-info" style={{ textAlign: "left" }}>{player.cost}</td>
                <td className="player-info" style={{ textAlign: "left" }}>{typeof player.xG === 'number' ? player.xG.toFixed(2) : player.xG}</td>
                <td className="player-info" style={{ textAlign: "left" }}>{typeof player.xGA === 'number' ? player.xGA.toFixed(2) : player.xGA}</td>
                <td className="player-info" style={{ textAlign: "left" }}>{typeof player.xGI === 'number' ? player.xGI.toFixed(2) : player.xGI}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayExpected;