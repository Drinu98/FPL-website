"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

type Fixture = {
  event: number;
  home: string;
  homeShort: string;
  homeImage: string;
  away: string;
  awayShort: string;
  awayImage: string;
  homeFdr: number;
  awayFdr: number;
  isHome: boolean;
  FDR: number;
};

type FixtureByEvent = {
  event: number;
  team: string;
  teamImage: string;
  opponentShort: string;
  isHome: boolean;
  FDR: number;
};

type DisplayFixturesProps = {
  fixturesArray: Array<Fixture>;
};

import React, { useMemo } from "react";

const nextGWFDR: Record<string, number> = {};
const next2FDRs: Record<string, number> = {};
const next3FDRs: Record<string, number> = {};
const next4FDRs: Record<string, number> = {};
const next5FDRs: Record<string, number> = {};
const next8FDRs: Record<string, number> = {};

const DisplayFDR = (props: DisplayFixturesProps) => {
  const { fixturesArray } = props;
  const [selectedData, setSelectedData] = useState("CurrentTeams");
  const [selectedFilter, setSelectedFilter] = useState<string>("easiest");
  const [sortedAndFilteredData, setSortedAndFilteredData] = useState<string[]>(
    []
  );

  const fixturesByTeamAndEvent: {
    [teamName: string]: {
      [event: number]: FixtureByEvent[];
    };
  } = useMemo(() => {
    const result: any = {};
  
    fixturesArray.forEach((fixture) => {
      const { home, away, event } = fixture;
  
      if (!result[home]) {
        result[home] = {};
      }
      if (!result[away]) {
        result[away] = {};
      }
  
      if (!result[home][event]) {
        result[home][event] = [];
      }
      if (!result[away][event]) {
        result[away][event] = [];
      }
  
      result[home][event].push({
        event: fixture.event,
        team: fixture.home,
        teamImage: fixture.homeImage,
        opponentShort: fixture.awayShort,
        isHome: true,
        FDR: fixture.homeFdr,
      });
      result[away][event].push({
        event: fixture.event,
        team: fixture.away,
        teamImage: fixture.awayImage,
        opponentShort: fixture.homeShort,
        isHome: false,
        FDR: fixture.awayFdr,
      });
    });
  
    // Add missing events for each team
    Object.keys(result).forEach((team) => {
      const events = new Set(
        fixturesArray.map((fixture) => fixture.event)
      );
  
      Array.from(events).forEach((event) => {
        if (!result[team][event]) {
          result[team][event] = null;
        }
      });
    });
  
    return result;
  }, [fixturesArray]);
  
  const teamNames = Object.keys(fixturesByTeamAndEvent).sort();

  // Get a sorted list of unique events in descending order
  const events = Array.from(
    new Set(fixturesArray.map((fixture) => fixture.event))
  ).sort((a, b) => a - b);

  function calculateFDRSum(team: any, fixtures: any, numberOfEvents: any) {
    const eventKeys = Object.keys(fixtures)
      .map(Number)
      .sort((a, b) => a - b);
    const eventsToConsider = eventKeys.slice(0, numberOfEvents);
  
    const fdrSum = eventsToConsider.reduce((sum, event) => {
      const eventFixtures = fixtures[event];
  
      if (eventFixtures === null || eventFixtures.length === 0) {
        // If there are no fixtures, add 7 to the fdrSum
        return sum + 5;
      }
  
      const eventFDR = eventFixtures.reduce((eventSum: any, fixture: any) => {
        return eventSum + fixture.FDR;
      }, 0);
  
      // Check if there are exactly 2 fixtures in the event
      if (eventFixtures.length === 2) {
        const result = 1 / eventFDR;
        return sum + (0 - result);
      } else {
        // If there are not 2 fixtures, simply add the eventFDR
        return sum + eventFDR;
      }
    }, 0);
  
    return fdrSum;
  }
  
  for (const team in fixturesByTeamAndEvent) {
    nextGWFDR[team] = calculateFDRSum(team, fixturesByTeamAndEvent[team], 1);
    next2FDRs[team] = calculateFDRSum(team, fixturesByTeamAndEvent[team], 2);
    next3FDRs[team] = calculateFDRSum(team, fixturesByTeamAndEvent[team], 3);
    next4FDRs[team] = calculateFDRSum(team, fixturesByTeamAndEvent[team], 4);
    next5FDRs[team] = calculateFDRSum(team, fixturesByTeamAndEvent[team], 5);
    next8FDRs[team] = calculateFDRSum(team, fixturesByTeamAndEvent[team], 8);
  }

  
  const sortTeamsEasiest = (fdrData: Record<string, number>) => {
    return Object.keys(fdrData).sort((teamA, teamB) => {
      return fdrData[teamA] - fdrData[teamB];
    });
  };

  const sortTeamsHardest = (fdrData: Record<string, number>) => {
    return Object.keys(fdrData).sort((teamA, teamB) => {
      return fdrData[teamB] - fdrData[teamA];
    });
  };

  const handleDataSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    setSelectedData(value);
  };

  const handleFilterSelect = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    setSelectedFilter(value);
  };

  useEffect(() => {
    // Filter the data based on selected position or team
    let filteredData: any[] = [];

    if (selectedFilter === "easiest") {
      if (selectedData === "CurrentTeams") {
        filteredData = teamNames;
      } else if (selectedData === "nextGWFDR") {
        const sortedTeamsEasiestGW = sortTeamsEasiest(nextGWFDR);
        filteredData = sortedTeamsEasiestGW;
      } else if (selectedData === "next2FDR") {
        const sortedTeamsEasiest2GWs = sortTeamsEasiest(next2FDRs);
        filteredData = sortedTeamsEasiest2GWs;
      } else if (selectedData === "next3FDR") {
        const sortedTeamsEasiest3GWs = sortTeamsEasiest(next3FDRs);
        filteredData = sortedTeamsEasiest3GWs;
      } else if (selectedData === "next4FDR") {
        const sortedTeamsEasiest4GWs = sortTeamsEasiest(next4FDRs);
        filteredData = sortedTeamsEasiest4GWs;
      } else if (selectedData === "next5FDR") {
        const sortedTeamsEasiest5GWs = sortTeamsEasiest(next5FDRs);
        filteredData = sortedTeamsEasiest5GWs;
      } else if (selectedData === "next8FDR") {
        const sortedTeamsEasiest8GWs = sortTeamsEasiest(next8FDRs);
        filteredData = sortedTeamsEasiest8GWs;
      }
    } else if (selectedFilter === "hardest") {
      if (selectedData === "CurrentTeams") {
        filteredData = teamNames;
      } else if (selectedData === "nextGWFDR") {
        const sortedTeamsHardestGW = sortTeamsHardest(nextGWFDR);
        filteredData = sortedTeamsHardestGW;
      } else if (selectedData === "next2FDR") {
        const sortedTeamsHardest2GWs = sortTeamsHardest(next2FDRs);
        filteredData = sortedTeamsHardest2GWs;
      } else if (selectedData === "next3FDR") {
        const sortedTeamsHardest3GWs = sortTeamsHardest(next3FDRs);
        filteredData = sortedTeamsHardest3GWs;
      } else if (selectedData === "next4FDR") {
        const sortedTeamsHardest4GWs = sortTeamsHardest(next4FDRs);
        filteredData = sortedTeamsHardest4GWs;
      } else if (selectedData === "next5FDR") {
        const sortedTeamsHardest5GWs = sortTeamsHardest(next5FDRs);
        filteredData = sortedTeamsHardest5GWs;
      } else if (selectedData === "next8FDR") {
        const sortedTeamsEasiest8GWs = sortTeamsHardest(next8FDRs);
        filteredData = sortedTeamsEasiest8GWs;
      }
    }

    setSortedAndFilteredData(filteredData);
    // Trim the sorted data to the top 30
  }, [selectedData, selectedFilter]);

  const router = usePathname();

  return (
    <div className="fixtureTicker-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Fixture Ticker</h2>
            {router ==='/' && (
              <a href="/fixtureTicker" className="expand-image-fdr">
                <Image
                  alt="expand"
                  src={"/images/expand.png"}
                  width={20}
                  height={20}    
                  className="expand-image"
                />
              </a>
            )}
          </div>
      <div>
        <select
          className="fdr-select-difficulty select"
          onChange={handleFilterSelect}
          value={selectedFilter}
        >
          <option value="easiest">Easiest</option>
          <option value="hardest">Hardest</option>
        </select>
        <select
          className="fdr-select select"
          onChange={handleDataSelect}
          value={selectedData}
        >
          <option value="CurrentTeams">Alphabetical</option>
          <option value="nextGWFDR">Next GW</option>
          <option value="next2FDR">Next 2 GWs</option>
          <option value="next3FDR">Next 3 GWs</option>
          <option value="next4FDR">Next 4 GWs</option>
          <option value="next5FDR">Next 5 GWs</option>
          <option value="next8FDR">Next 8 GWs</option>
        </select>
      </div>

      <div style={{ overflow: "auto" }}>
        <table className="fixtureTicker-table" style={{}}>
          <thead>
            <tr>
              <th></th>
              {events.map((event) => (
                <th
                  key={event}
                  style={{ textAlign: "center" }}
                  className="fdr-teamNames"
                >
                  GW {event}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="transfers-body">
            {sortedAndFilteredData.map((teamName, index) => (
              <tr
                key={teamName}
                style={{
                  borderTop: "1px solid rgba(55, 0, 60, 0.08)",
                  // verticalAlign: "baseline",
                  // display:'flex'
                }}
              >
                <td
                  className="fdr-teamNames"
                  style={{
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {(() => {
                    const firstEvent =
                      fixturesByTeamAndEvent[teamName][events[0]];
                    const secondEvent =
                      fixturesByTeamAndEvent[teamName][events[1]];

                    const teamImage =
                      (firstEvent && firstEvent[0]?.teamImage) ||
                      (secondEvent && secondEvent[0]?.teamImage);

                    return teamImage ? (
                      <Image
                        alt="team"
                        src={teamImage}
                        width={25}
                        height={25}
                        style={{ marginRight: "5px" }}
                        className="fdr-image"
                      />
                    ) : null;
                  })()}
                  {teamName}
                </td>
                {events?.map((event) => (
                  <td
                    key={event}
                    style={{
                      textAlign: "center",
                      // paddingRight: "0px",
                      // display:
                      //   fixturesByTeamAndEvent[teamName][event]?.length > 1
                      //     ? "inline-block"
                      //     : "",
                      alignItems:'center',
                      justifyContent:'center'
                    }}
                    className={`${fixturesByTeamAndEvent[teamName][event]?.length > 1 ? 'dynamic' : ''}`}
                  >
                    {fixturesByTeamAndEvent[teamName][event] ? (
                      fixturesByTeamAndEvent[teamName][event]?.map(
                        (fixture: FixtureByEvent, index) => (

                          <div
                            key={fixture.event + index}
                            className={`fdr-opponents ${fixturesByTeamAndEvent[teamName][event]?.length > 1 ? 'dynamic-width' : ''}`}
                            style={{
                              backgroundColor:
                                fixture.FDR === 1
                                  ? "#0492cf"
                                  : fixture.FDR === 2
                                  ? "#7bc043"
                                  : fixture.FDR === 3
                                  ? "#fdf498"
                                  : fixture.FDR === 4
                                  ? "#f37736"
                                  : fixture.FDR === 5
                                  ? "#ee4035"
                                  : "transparent",
                              marginTop:
                                fixturesByTeamAndEvent[teamName][event]
                                  ?.length > 1 && index === 1
                                  ? "0px"
                                  : "",
                              // marginBottom:
                              //   fixturesByTeamAndEvent[teamName][event]
                              //     ?.length > 1 && index === 0
                              //     ? "5px"
                              //     : "",
                              marginRight:
                                fixturesByTeamAndEvent[teamName][event]
                                  ?.length > 1 && index === 0
                                  ? "4px"
                                  : "",
                              padding:
                                fixturesByTeamAndEvent[teamName][event]
                                  ?.length > 1
                                  ? "10px 0px"
                                  : "",
                                  display:
                        fixturesByTeamAndEvent[teamName][event]?.length > 1
                          ? "inline-flex"
                          : "",
                            }}
                          >
                            {fixture.isHome ? (
                              <span>{fixture.opponentShort} (H)</span>
                            ) : (
                              <span>{fixture.opponentShort} (A)</span>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div
                        className="fdr-opponents"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        No Fixture
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DisplayFDR;
