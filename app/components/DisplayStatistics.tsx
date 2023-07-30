"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

type Player = {
    web_name: string
    selected_by_percent: string
    total_points: number
    event_points: number
    minutes: number
    goals: number
    assists: number
    clean_sheets: number
    goals_conceded: number
    own_goals: number
    penalties_saved: number
    penalties_missed: number
    yellow_cards: number
    red_cards: number
    saves: number
    bonus: number
    bps: number
    influence: string
    creativity: string
    threat: string
    ict_index: string
    form: string
    dreamteam_count: number
    value_form: string
    value_season: string
    points_per_game: string
    transfers_in: number
    transfers_out: number
    transfers_in_event: number
    transfers_out_event: number
    cost: string
    cost_change_start: number
    cost_change_start_fall: number
    xGC: string
    starts: number
    photo: string
    position_short: string
    position_long: string
    team_short: string
    team: string
}

// type DisplayPlayersType = 'selected' | 'total_points' | 'event_points' | 'minutes' | ''

type DisplayTransfersProps = {
    playerData: Array<Player>
}

const DisplayStatistics = (props: DisplayTransfersProps) => {
    const {playerData} = props
    // const [showTransfers, setTransfers] = useState<DisplayPlayersType>('selected');
    const [selectedFilter, setSelectedFilter] = useState<string>(""); // State for selected position or team
    const [selectedProperty, setSelectedProperty] = useState<keyof Player>('ict_index');
    // const [sortedAndTrimmedData, setSortedAndTrimmedData] = useState<Player[]>([]);
    const [sortedAndFilteredData, setSortedAndFilteredData] = useState<Player[]>([]);

    // const sortData = (data: Player[], property: keyof Player) => {
    //   return data.slice().sort((a, b) => {
    //     if (property === 'selected_by_percent' || property === 'total_points' || property === 'cost') {
    //       const aValue = parseFloat(String(a[property]));
    //       const bValue = parseFloat(String(b[property]));
    
    //       if (!isNaN(aValue) && !isNaN(bValue)) {
    //         // If both values are valid numbers, compare them as numbers
    //         return bValue - aValue;
    //       }
    //     } else {
    //       // For other properties, compare them as strings
    //       const aStr = String(a[property]);
    //       const bStr = String(b[property]);
    //       return bStr.localeCompare(aStr);
    //     }
    
    //     // Default return value when no specific conditions are met
    //     return 0;
    //   });
    // };

    const sortData = (data: Player[], property: keyof Player) => {
      const customCompare = (a: string | number, b: string | number) => {
        if (typeof a === "string" && typeof b === "string") {
          // If both values are strings, compare them as strings
          return a.localeCompare(b);
        } else if (typeof a === "number" && typeof b === "number") {
          // If both values are numbers, compare them as numbers
          return b - a;
        } else if (typeof a === "number" && typeof b === "string") {
          // If one is a number and the other is a string, the number should come first
          return -1;
        } else {
          // If one is a string and the other is a number, the number should come first
          return 1;
        }
      };
    
      return data.slice().sort((a, b) => {
        const aValue = parseFloat(String(a[property]).replace(",", ""));
        const bValue = parseFloat(String(b[property]).replace(",", ""));
    
        if (!isNaN(aValue) && !isNaN(bValue)) {
          // If both values are valid numbers, use the custom comparison function
          return customCompare(aValue, bValue);
        } else {
          // If one or both values are not valid numbers, use the custom comparison function with the string representation
          return customCompare(String(a[property]), String(b[property]));
        }
      });
    };
 
    const trimData = (data: Player[]) => {
      return data.slice(0, 30);
    };

    // Get unique positions and teams from playerData
  const positions = Array.from(new Set(playerData.map((player) => player.position_long)));
  const teams = Array.from(new Set(playerData.map((player) => player.team)));

  const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setSelectedFilter(selectedFilter);
  };

    // useEffect(() => {
    //   const sortedData = sortData(playerData, selectedProperty);
    //   const trimmedData = trimData(sortedData);
    //   setSortedAndTrimmedData(trimmedData);
    // }, [playerData, selectedProperty]);

    useEffect(() => {
      // Filter the data based on selected position or team
      let filteredData = playerData;
      if (selectedFilter) {
        filteredData = filteredData.filter(
          (player) => player.position_long === selectedFilter || player.team === selectedFilter
        );
      }
  
      // Sort and trim the filtered data
      const sortedData = sortData(filteredData, selectedProperty);
      const trimmedData = trimData(sortedData);
      setSortedAndFilteredData(trimmedData);
    }, [playerData, selectedFilter, selectedProperty]);

    // function toggleDisplayPlayers(nextDisplayType : DisplayPlayersType) {
    //   setTransfers(nextDisplayType);
    // }
    useEffect(() => {
      // Set the default value of the filter to "All Positions/Teams" when the page loads
      setSelectedFilter("");
    }, []);

    const handlePropertySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProperty = event.target.value as keyof Player;
        setSelectedProperty(selectedProperty);
      };

      type DisplayPlayersTypes = keyof Player;

      const customDisplayNames: Record<DisplayPlayersTypes, string> = {
        web_name: "Player Name",
        selected_by_percent: "Selected %",
        total_points: "Total Points",
        event_points: "Event Points",
        minutes: "Minutes",
        goals: "Goals",
        assists: "Assists",
        clean_sheets: "Clean Sheets",
        goals_conceded: "Goals Conceded",
        own_goals: "Own Goals",
        penalties_saved: "Penalties Saved",
        penalties_missed: "Penalties Missed",
        yellow_cards: "Yellow Cards",
        red_cards: "Red Cards",
        saves: "Saves",
        bonus: "Bonus",
        bps: "Bonus Points System",
        influence: "Influence",
        creativity: "Creativity",
        threat: "Threat",
        ict_index: "ICT Index",
        form: "Form",
        dreamteam_count: "Times in Dream Team",
        value_form: "Value (form)",
        value_season: "Value (season)",
        points_per_game: "Points Per Game",
        transfers_in: "Transfers in",
        transfers_out: "Transfers out",
        transfers_in_event: "Transfers In Gameweek",
        transfers_out_event: "Transfers Out Gameweek",
        cost: "Cost",
        cost_change_start: "Price Rice",
        cost_change_start_fall: "Price Fall",
        xGC: "xGC(Total)",
        starts: "Starts",
        photo: "Photo",
        position_short: "Position short",
        position_long: "Position Long",
        team_short: "Team Short",
        team: "Team name"
      };

    return (
        <div className='transfers-container'>
        <div className='graphic-container'>
          <h2 className='transfers-title'>Statistics</h2>
        </div>
        <div  style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <select
            value={selectedFilter}
            onChange={handleFilterSelect}
            className="statistics-select-teams select"
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
        {/* <div className="text-center captaincy-button-box"> */}
        <select value={selectedProperty} onChange={handlePropertySelect} className='statistics-select select'>
            {/* Display all keys as options, except 'web_name' */}
            {Object.keys(playerData[0]).filter(key => key !== 'web_name' && key !== 'position' && key !== 'photo' && key !== 'team' && key !== 'position_short' && key !== 'position_long').map((key, index) => (
              <option key={index} value={key as DisplayPlayersTypes}>
                {customDisplayNames[key as DisplayPlayersTypes]}
              </option>
            ))}
        </select>
        {/* </div> */}
        <table className="transfers-table">
                <thead>
                  <tr>
                    <th className="transfer-header"></th>
                    <th className="transfer-header"></th>
                    <th className="transfer-header">Name</th>
                    <th className="transfer-header">Cost</th>
                    <th className="transfer-header">Selected</th>
                    <th className="transfer-header">Points</th>
                    <th className="transfer-header">**</th>
                    {/* {!(selectedProperty === 'selected_by_percent' || selectedProperty === 'total_points' || selectedProperty === 'cost') && (
              
            )} */}
                  </tr>
                </thead>
                <tbody className="transfers-body">
                  {sortedAndFilteredData.map((player, index) => (
                    <tr key={index} className="table-row">
                      <td><Image className="player-photo" src={player.photo} alt={player.web_name} width={65} height={80}/></td>
                      <td></td>
                      <td className="player-info">
                        <div style={{textAlign: 'left'}}>{player.web_name}</div>
                        <div className='player-transfer-info-box' style={{textAlign: 'left'}}>
                          <span>
                            {player.team_short}
                          </span>
                          <span className='transfers-team-box' style={{textAlign: 'left'}}>
                            {player.position_short}
                          </span> 
                        </div>
                      </td>
                      <td className="player-info" style={{textAlign: 'left'}}>{player.cost}</td>
                      <td className="player-info" style={{textAlign: 'left'}}>{player.selected_by_percent}%</td>
                      <td className="player-info" style={{textAlign: 'left'}}>{player.total_points}</td>
                      <td className="player-info" style={{textAlign: 'left'}}>{player[selectedProperty]}</td>
                    </tr>
                  ))} 
                </tbody>
              </table>
        </div>
</div>
    )
}

export default DisplayStatistics