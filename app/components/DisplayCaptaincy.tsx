"use client";

import { useState } from "react";
import Image from "next/image";

type Player = {
  name: string;
  chosenAsCaptainPercentage: number;
  chosenEffectiveOwnershipPercentage: number;
};

type DisplayCaptaincyProps = {
  captaincy: Array<Player>;
  eo: Array<Player>;
  gameweek: number;
  chosenEffectiveOwershipPercentage: number;
};

type DisplayPlayersType = "captaincy" | "eo";

function Captaincy(props: DisplayCaptaincyProps) {
  const { captaincy, eo, gameweek } = props;

  const [showCaptains, setShowCaptains] =
    useState<DisplayPlayersType>("captaincy");
  const [selectedButton, setSelectedButton] =
    useState<DisplayPlayersType>("captaincy");

  function toggleDisplayPlayers(nextDisplayType: DisplayPlayersType) {
    setShowCaptains(nextDisplayType);
  }

  const player = showCaptains === "captaincy" ? captaincy : eo;

  return (
    <div className="captaincy-container">
      <div className="graphic-container">
        <h2 className="transfers-title">Top 10K</h2>
        <a href="/top10k" className="expand-image-captaincy">
              <Image
                alt="expand"
                src={"/images/expand.png"}
                width={20}
                height={20}    
                className="expand-image"
              />
        </a>
      </div>
      <div>
        <h2 className="deadline-date">Gameweek {gameweek}</h2>
      </div>
      <div style={{ overflowX: "hidden", overflowY: "auto" }}>
        <div className="text-center captaincy-button-box">
          <button
            className={`captaincy-button ${
              showCaptains === "captaincy" ? "selected" : ""
            }`}
            onClick={() => {
              setShowCaptains("captaincy");
              setSelectedButton("captaincy");
            }}
          >
            Captains
          </button>
          <button
            className={`captaincy-button ${
              showCaptains === "eo" ? "selected" : ""
            }`}
            onClick={() => {
              setShowCaptains("eo");
              setSelectedButton("eo");
            }}
          >
            EO
          </button>
        </div>
        <table
          className="transfers-table-captaincy"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th className="transfer-header"></th>
              <th className="transfer-header" style={{ width: "30%" }}>
                Name
              </th>
              <th className="transfer-header"></th>
              <th className="transfer-header"></th>
              <th className="transfer-header">
                {selectedButton === "captaincy" ? "Captaincy" : "EO"}
              </th>
              <th className="transfer-header"></th>
            </tr>
          </thead>
          <tbody className="table-body-captaincy">
            {player.map((player, index) => (
              <tr key={index} className="table-row">
                <td></td>
                <td className="player-info-captaincy">{player.name}</td>
                <td></td>
                <td></td>
                <td className="player-info-captaincy">
                  {showCaptains === "captaincy"
                    ? player.chosenAsCaptainPercentage + "%"
                    : player.chosenEffectiveOwnershipPercentage + "%"}
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Captaincy;
