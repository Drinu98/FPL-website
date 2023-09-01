"use client";

import React, { useState, useEffect } from "react";

type Player = {
  name: string;
  team: string;
  teamLong: string;
  position_short: string;
  position: string;
  xG: string;
  xGA: string;
  xGI: string;
};

type ExpectedProps = {
  currentGameweekXG: Array<Player>;
  previousGameweekXG: Array<Player>;
  xGTotalLast4Gameweeks: Array<Player>;
  xGTotal: Array<Player>;
};

// type DisplayGamweeksType = 'currentGameweekXG' | 'xGTotalLast4Gameweeks' | 'xGTotal'
type DisplayGamweeksType =
  | "currentGameweekXG"
  | "xGTotalLast4Gameweeks"
  | "xGTotal";

function Expected(props: ExpectedProps) {
  const { currentGameweekXG, previousGameweekXG, xGTotal } = props;
  const [selectedData, setSelectedData] = useState(currentGameweekXG);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [sortedAndFilteredData, setSortedAndFilteredData] = useState<Player[]>(
    []
  );
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  const positions = Array.from(
    new Set(currentGameweekXG.map((player) => player.position))
  );
  const teams = Array.from(
    new Set(currentGameweekXG.map((player) => player.teamLong))
  );

  const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setSelectedFilter(selectedFilter);
  };

  const trimData = (data: Player[]) => {
    return data.slice(0, 30);
  };

  const handleDataSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    switch (value) {
      case "currentGameweekXG":
        setSelectedData(currentGameweekXG);
        break;
      case "previousGameweekXG":
        setSelectedData(previousGameweekXG);
        break;
      case "xGTotal":
        setSelectedData(xGTotal);
        break;
      default:
        setSelectedData(currentGameweekXG);
        break;
    }
  };

  useEffect(() => {
    // Filter the data based on selected position or team
    let filteredData = selectedData;
    if (selectedFilter) {
      filteredData = filteredData.filter(
        (player) =>
          player.position === selectedFilter ||
          player.teamLong === selectedFilter
      );
    }

    // Sort the filtered data by descending xGI
    filteredData.sort((a, b) => parseFloat(b.xGI) - parseFloat(a.xGI));

    // Trim the sorted data to the top 30
    const trimmedData = trimData(filteredData);
    setSortedAndFilteredData(trimmedData);
  }, [selectedData, selectedFilter]);

  const handleSortClick = (columnName: any) => {
    // Sort the selectedData array by the given column name
    const sortedData = sortedAndFilteredData.sort((a: any, b: any) => {
      if (sortOrder === "asc") {
        return a[columnName] - b[columnName];
      } else {
        return b[columnName] - a[columnName];
      }
    });

    setSortedAndFilteredData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <>
      <div className="transfers-container">
        <div className="graphic-container">
          <h2 className="transfers-title">Expected Data</h2>
        </div>
        <div style={{ overflowY: "auto", overflowX: "hidden" }}>
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
          <select
            className="expected-select select"
            onChange={handleDataSelect}
            value={
              selectedData === currentGameweekXG
                ? "currentGameweekXG"
                : selectedData === previousGameweekXG
                ? "previousGameweekXG"
                : "xGTotal"
            }
          >
            <option value="currentGameweekXG">Current Gameweek</option>
            <option value="previousGameweekXG">Gameweek 3</option>
            <option value="xGTotal">Total</option>
            {/* <option value="xGTotalLast4Gameweeks">Last 4 GWs</option> */}
            {/* <option value="xGTotal">Last 6 GWs</option> */}
          </select>
          <div>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th className="transfer-header"></th>
                  <th className="transfer-header">Name</th>
                  <th className="transfer-header">Team</th>
                  <th className="transfer-header">Position</th>
                  <th
                    className="transfer-header"
                    onClick={() => handleSortClick("xG")}
                  >
                    xG {sortOrder === "asc" ? "▲" : "▼"}
                  </th>
                  <th
                    className="transfer-header"
                    onClick={() => handleSortClick("xGA")}
                  >
                    xA {sortOrder === "asc" ? "▲" : "▼"}
                  </th>
                  <th
                    className="transfer-header"
                    onClick={() => handleSortClick("xGI")}
                  >
                    xGI {sortOrder === "asc" ? "▲" : "▼"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredData.map((gwObj, index) => (
                  <tr key={index} className="table-row">
                    <td></td>
                    <td className="player-info" style={{ textAlign: "left" }}>
                      {gwObj.name}
                    </td>
                    <td className="player-info" style={{ textAlign: "left" }}>
                      {gwObj.team}
                    </td>
                    <td className="player-info" style={{ textAlign: "left" }}>
                      {gwObj.position_short}
                    </td>
                    <td className="player-info" style={{ textAlign: "left" }}>
                      {gwObj.xG}
                    </td>
                    <td className="player-info" style={{ textAlign: "left" }}>
                      {gwObj.xGA}
                    </td>
                    <td className="player-info" style={{ textAlign: "left" }}>
                      {gwObj.xGI}
                    </td>
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
