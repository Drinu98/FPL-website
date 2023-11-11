"use client";

import React, { useState } from "react";

type Player = {
    team: string,
    penalties: Array<string>,
    freeKicks: Array<string>,
    corners: Array<string>,
    notes: Array<string>
};

type SetPiecesProps = {
  // injuries: Array<any>
  setPieces: Array<Player>;
};

function Injuries(props: SetPiecesProps) {
    const { setPieces } = props;
    const [selectedTeam, setSelectedTeam] = useState("Arsenal");
  
    const teams = Array.from(new Set(setPieces.map((player) => player.team)));
  
    const handleTeamSelect = (event: React.FormEvent<HTMLSelectElement>) => {
      setSelectedTeam(event.currentTarget.value);
    };
  
    // Filter the setPieces based on the selected team
    const filteredSetPieces = setPieces.filter((player) => player.team === selectedTeam);
  
    const selectedTeamNotes = filteredSetPieces.length > 0 ? filteredSetPieces[0].notes : [];

    // console.log(filteredSetPieces);
    return (
      <>
        <div className="transfers-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Set Piece Takers</h2>
          </div>
          <label>
            <select
              value={selectedTeam}
              onChange={handleTeamSelect}
              className="injury-select select"
            >
              {/* Add the "All Players" option */}
              {teams.map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </label>
          <div style={{ overflowY: "auto", overflowX: "hidden" }}>
            <table className="setPieces-table" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th className="transfer-header" style={{paddingLeft: '40px'}}>Corners</th>
                  <th className="transfer-header">Direct free-kicks</th>
                  <th className="transfer-header">Corners & indirect free-kicks</th>
                </tr>
              </thead>
              <tbody className="transfers-body">
                <tr>
                  <td className="player-info" style={{ textAlign: "left", verticalAlign: "top", paddingLeft: '40px' }}>
                    <div>
                      <ul style={{ listStyle: 'none'}}>
                        {filteredSetPieces
                          .filter((player) => player.penalties)
                          .map((player) =>
                            player.penalties.map((penaltyTaker, index) => (
                              <li key={index} style={{marginBottom: '5px', marginTop:'5px'}}>{penaltyTaker}</li>
                            ))
                          )}
                      </ul>
                    </div>
                  </td>
                  <td className="player-info" style={{ textAlign: "left", verticalAlign: "top" }}>
                    <div>
                      <ul style={{ listStyle: 'none' }}>
                        {filteredSetPieces
                          .filter((player) => player.freeKicks)
                          .map((player) =>
                            player.freeKicks.map((freeKickTaker, index) => (
                              <li key={index} style={{marginBottom: '5px', marginTop:'5px'}}>{freeKickTaker}</li>
                            ))
                          )}
                      </ul>
                    </div>
                  </td>
                  <td className="player-info" style={{ textAlign: "left", verticalAlign: "top" }}>
                    <ul style={{ listStyle: 'none'}}>
                      {filteredSetPieces
                        .filter((player) => player.corners)
                        .map((player) =>
                          player.corners.map((cornerTaker, index) => (
                            <li key={index} style={{marginBottom: '5px', marginTop:'5px'}}>{cornerTaker}</li>
                          ))
                        )}
                    </ul>
                  </td>
                </tr>
                <tr className="table-row">
                <th colSpan={3} className="transfer-header" style={{paddingLeft:'35px', paddingTop:'10px'}}>Notes</th>
              </tr>
              <tr className="table-row">
                <td colSpan={3} className="player-info" style={{ textAlign: "left"}}>
                  <div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {selectedTeamNotes.map((note: any, index: any) => (
                        <li key={index} style={{marginTop:'20px', paddingLeft:'30px', paddingRight:'30px'}}>{note.info_message}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
  
  export default Injuries;
  