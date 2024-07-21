"use client";

import Image from "next/image";
import Search from "./search2";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

type Team = {
  GwGross: number;
  GwNet: string;
  IsFinished: boolean;
  NumTransfers: number;
  OverallRank: string;
  OverallRankDirection: string;
  PlayerName: string;
  TeamName: string;
  TransferCost: number;
};

export default function LiveRank() {
  const [teamData, setTeamData] = useState<Team>();

  const search = useSearchParams();
  const searchQuery = search ? search.get("id") : null;

  const encodedSearchQuery = encodeURI(searchQuery || "");

  useEffect(() => {
    if (!searchQuery || searchQuery === '0') {
      setTeamData(undefined);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/search?id=${encodedSearchQuery}`);
        if (!response.ok) {
          throw new Error("Failed to fetch team data");
        }
        const team = await response.json();
        setTeamData(team.team);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchData();
  }, [encodedSearchQuery]);

  const overallRank = Number(teamData?.OverallRank);

  // Check if overallRank is a valid number before applying toLocaleString
  const formattedRank = isNaN(overallRank)
    ? teamData?.OverallRank
    : overallRank.toLocaleString();

  return (
    <div className="pricechanges-container">
      <div className="graphic-container">
        <h2 className="transfers-title">Live Rank</h2>
      </div>
      <div className="liveTeamBox">
        <h2 className="liveTeam">
          {teamData?.TeamName ?? "Team name"} (
          {teamData?.PlayerName ?? "Player name"})
        </h2>
      </div>
      <div className="rankBox">
        <table style={{ width: "80%", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>GW Net</th>
              <th style={{ textAlign: "center" }}>Transfers</th>
              <th style={{ textAlign: "center" }}>Live Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>
                {teamData?.GwNet !== null && teamData?.GwNet !== undefined
                  ? teamData?.GwNet
                  : 0}
              </td>

              <td style={{ textAlign: "center" }}>
                {teamData?.NumTransfers !== undefined ? (
                  <>
                    {teamData?.NumTransfers}
                    {teamData?.TransferCost < 0 &&
                      ` (${teamData?.TransferCost})`}
                  </>
                ) : (
                  0
                )}
              </td>

              <td
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formattedRank !== null && formattedRank !== undefined ? (
                  <>
                    {formattedRank}
                    <Image
                      alt={
                        teamData?.OverallRankDirection === "down"
                          ? "greenarrow down"
                          : teamData?.OverallRankDirection === "up"
                          ? "redarrow up"
                          : "Grey Arrow" // Set alt to "Grey Arrow" if direction is null
                      }
                      src={
                        teamData?.OverallRankDirection === "down"
                          ? "/images/greenarrowdark.png"
                          : teamData?.OverallRankDirection === "up"
                          ? "/images/redarrowdark.png"
                          : "/images/grey.png" // Use grey.png if direction is null
                      }
                      width={17}
                      height={17}
                      className="arrow-icon"
                      style={{ marginLeft: "3px" }}
                    />
                  </>
                ) : (
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="searchBox">
        <Search />
      </div>
      <div className="liveRankLink-box">
        <p>
          Live rank via{" "}
          <a
            target="_blank"
            href="https://www.fplgameweek.com/"
            style={{ color: "#f2055c" }}
            rel="noopener noreferrer"
          >
            FPLGameweek.com
          </a>
        </p>
      </div>
    </div>
  );
}
