"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from 'next/navigation';

type Player = {
  photo: string;
  web_name: string;
  team: string;
  position: string;
  cost: string;
  selected_by_percent: string;
  transfers_in: number;
  transfers_out: number;
  total_points: string;
};

type DisplayPlayersType = "in" | "out";

type DisplayTransfersProps = {
  topPlayersIn: Array<Player>;
  topPlayersOut: Array<Player>;
};

const DisplayTransfers = (props: DisplayTransfersProps) => {
  const { topPlayersIn, topPlayersOut } = props;
  const [showTransfers, setTransfers] = useState<DisplayPlayersType>("in");
  const [selectedButton, setSelectedButton] =
    useState<DisplayPlayersType>("in");

  function toggleDisplayPlayers(nextDisplayType: DisplayPlayersType) {
    setTransfers(nextDisplayType);
  }

  const players = showTransfers === "in" ? topPlayersIn : topPlayersOut;

  const router = usePathname();

  return (
    <div className="transfers-container">
      <div className="graphic-container">
        <h2 className="transfers-title">Top 10 Transfers</h2>
        {router ==='/' && (
          <a href="/transfers" className="expand-image-transfers">
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
      <div style={{ overflowY: "auto", overflowX: "hidden" }}>
        <div className="text-center captaincy-button-box">
          <button
            className={`transfers-button ${
              showTransfers === "in" ? "selected" : ""
            }`}
            onClick={() => {
              setTransfers("in");
              setSelectedButton("in");
            }}
          >
            In
          </button>
          <button
            className={`transfers-button ${
              showTransfers === "out" ? "selected" : ""
            }`}
            onClick={() => {
              setTransfers("out");
              setSelectedButton("out");
            }}
          >
            Out
          </button>
        </div>
        <table className="transfers-table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header">Name</th>
              <th className="transfer-header">Cost</th>
              <th className="transfer-header">Selected</th>
              <th className="transfer-header">Points</th>
              <th className="transfer-header">Transfers</th>
            </tr>
          </thead>
          <tbody className="transfers-body">
            {players.map((player, index) => (
              <tr key={index} className="table-row">
                <td>
                  <Image
                    className="player-photo"
                    src={player.photo}
                    alt={player.web_name}
                    width={65}
                    height={80}
                  />
                </td>
                {/* <td></td> */}
                <td className="player-info">
                  <div style={{ textAlign: "left" }}>{player.web_name}</div>
                  <div
                    className="player-transfer-info-box"
                    style={{ textAlign: "left" }}
                  >
                    <span>{player.team}</span>
                    <span
                      className="transfers-team-box"
                      style={{ textAlign: "left" }}
                    >
                      {player.position}
                    </span>
                  </div>
                </td>
                <td className="player-info" style={{ textAlign: "left" }}>
                  {player.cost}
                </td>
                <td className="player-info" style={{ textAlign: "left" }}>
                  {player.selected_by_percent}%
                </td>
                <td className="player-info" style={{ textAlign: "left" }}>
                  {player.total_points}
                </td>
                <td className="player-info" style={{ textAlign: "left" }}>
                  {showTransfers === "in"
                    ? player.transfers_in.toLocaleString()
                    : player.transfers_out.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayTransfers;
