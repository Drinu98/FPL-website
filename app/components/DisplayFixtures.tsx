"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA, faFutbol } from "@fortawesome/free-solid-svg-icons";

type Fixture = {
  home: string;
  homeImage: string;
  away: string;
  awayImage: string;
  date: string;
  started: boolean;
  homeScore: number;
  awayScore: number;
  finished: boolean;
  bps: Array<any>;
  bonus: Array<any>;
};

type DisplayFixturesProps = {
  fixturesArray: Array<Fixture>;
};

const DisplayFixtures = (props: DisplayFixturesProps) => {
  const { fixturesArray } = props;

  const formattedFixtures: any = fixturesArray.map((fixture) => {
    const deadlineTime = new Date(fixture.date);

    const kickOffDate = deadlineTime.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "short",
    });
    const kickOffTime = deadlineTime.toLocaleString("en-GB", {
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    });

    return {
      ...fixture,
      kickOffDate: kickOffDate,
      time: kickOffTime,
    };
  });

  const sortedFixtures = formattedFixtures?.sort(
    (a: any, b: any) => Date.parse(a.date) - Date.parse(b.date)
  );

  // group the fixtures by date using an object
  const fixturesByDate: { [key: string]: any } = {};

  sortedFixtures?.forEach((fixture: any) => {
    const date = fixture.kickOffDate;

    if (!fixturesByDate[date]) {
      fixturesByDate[date] = [];
    }

    fixturesByDate[date]?.push(fixture);
  });

  return (
    <>
      {
        <div className="fixture-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Bonus Points</h2>
          </div>
          <ul
            className="fixture-ul-list"
            style={{
              padding: 0,
              margin: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* loop through the fixtures grouped by date */}
            {Object.keys(fixturesByDate).map((date) => (
              <li key={date}>
                <div className="fixture-date-box">
                  <span className="fixture-date-inner-box">
                    <h4 className="fixture-date">{date}</h4>
                  </span>
                </div>
                <ul className="fixture-ul-list">
                  {fixturesByDate[date]?.map((fixture: any, index: any) => (
                    <li className="fixture-item" key={index}>
                      <div className="fixture-home-box">
                        <div className="fixture-inner-box">
                          <div className="home-box">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <span className="home-text">{fixture.home}</span>
                              <div className="home-image-box">
                                <Image
                                  className="home-image"
                                  src={fixture.homeImage}
                                  alt={fixture.home}
                                  width={40}
                                  height={40}
                                />
                              </div>
                            </div>
                          </div>
                          {fixture.started ? (
                            <>
                              {/* <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', flex: '1 0 3.6rem'}}> */}
                              <span className="score-box">
                                {fixture.homeScore} - {fixture.awayScore}{" "}
                              </span>
                              {/* <span className='minutes'>
                                  {fixture.started && !fixture.finished ? 'LIVE' : ''}
                                </span> */}
                              {/* </div> */}
                            </>
                          ) : (
                            <span className="time-box">{fixture.time}</span>
                          )}
                          <div className="away-box">
                            <div className="away-image-box">
                              <Image
                                className="away-image"
                                src={fixture.awayImage}
                                alt={fixture.away}
                                width={40}
                                height={40}
                              />
                            </div>
                            <span className="away-text">{fixture.away} </span>
                          </div>
                        </div>
                      {fixture.started ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              width: "50%",
                              justifyContent: "right",
                              borderRight: "1px solid #ccc",
                              flexDirection: "column",
                            }}
                          >
                            <div className="scorers-box-home">
                              <ul
                                className="scorers-list"
                                style={{ marginBottom: "5px" }}
                              >
                                {fixture.scorers?.map(
                                  (scorer: any, index: any) => (
                                    <>
                                      <li
                                        key={scorer.id}
                                        className="scorer-item"
                                        style={{
                                          display: "flex",
                                          justifyContent:
                                            scorer.team === "home"
                                              ? "flex-end"
                                              : "flex-start", // Align to the end for home team scorers
                                          alignItems: "center",
                                        }}
                                      >
                                        {scorer.team === "home" ? (
                                          <span
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {scorer.name}
                                            {[...Array(scorer.value)].map(
                                              (_, i) => (
                                                <FontAwesomeIcon
                                                  key={i}
                                                  icon={faFutbol}
                                                  className="home-icon-goals"
                                                />
                                              )
                                            )}
                                          </span>
                                        ) : null}
                                      </li>
                                    </>
                                  )
                                )}
                                  {fixture.ownGoals?.map((scorer: any, index: any) =>
                                    <li
                                    key={scorer.id}
                                        className="scorer-item"
                                        style={{
                                          display: "flex",
                                          justifyContent:
                                            scorer.team === "away"
                                              ? "flex-end"
                                              : "flex-start", // Align to the end for home team scorers
                                          alignItems: "center",
                                    }}
                                  >
                                    {scorer.team === "away" ? (
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {scorer.name}
                                        {[...Array(scorer.value)].map(
                                          (_, i) => (
                                            <FontAwesomeIcon
                                              key={i}
                                              icon={faFutbol}
                                              className="home-icon-ownGoals"
                                            />
                                          )
                                        )} 
                                      </span>
                                    ) : null}
                                  </li>
                                  )}
                              </ul>
                            </div>
                            <div className="scorers-box-home">
                              <ul className="scorers-list">
                                {fixture.assists?.map(
                                  (assist: any, index: any) => (
                                    <li
                                      key={assist.id}
                                      className="scorer-item"
                                      style={{
                                        display: "flex",
                                        justifyContent:
                                          assist.team === "home"
                                            ? "flex-end"
                                            : "flex-start", // Align to the end for home team scorers
                                        alignItems: "center",
                                        textAlign: "left",
                                      }}
                                    >
                                      {assist.team === "home" ? (
                                        <span
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {assist.name}
                                          {[...Array(assist.value)].map(
                                            (_, i) => (
                                              <FontAwesomeIcon
                                                key={i}
                                                icon={faA}
                                                className="home-icon-assists"
                                              />
                                            )
                                          )}
                                        </span>
                                      ) : null}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "50%",
                              
                            }}
                          >
                            <div style={{display: "flex", justifyContent: "left", flexDirection: "column", width:'50%'}}>
                              <div className="scorers-box-away">
                                <ul
                                  className="scorers-list"
                                  style={{ marginBottom: "5px" }}
                                >
                                  {fixture.scorers?.map(
                                    (scorer: any, index: any) => (
                                      <li
                                        key={scorer.id}
                                        className="scorer-item"
                                        style={{ display: "flex" }}
                                      >
                                        {scorer.team === "away" ? (
                                          <span
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {[...Array(scorer.value)].map(
                                              (_, i) => (
                                                <FontAwesomeIcon
                                                  key={i}
                                                  icon={faFutbol}
                                                  className="away-icon-goals"
                                                />
                                              )
                                            )}
                                            {scorer.name}
                                          </span>
                                        ) : null}
                                      </li>
                                    )
                                  )}
                                  {fixture.ownGoals?.map((scorer: any, index: any) =>
                                    <li
                                    key={scorer.id}
                                        className="scorer-item"
                                        style={{
                                          display: "flex",
                                    }}
                                  >
                                    {scorer.team === "home" ? (
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        
                                        {[...Array(scorer.value)].map(
                                          (_, i) => (
                                            <FontAwesomeIcon
                                              key={i}
                                              icon={faFutbol}
                                              className="away-icon-ownGoals"
                                            />
                                          )
                                        )}
                                        {scorer.name} 
                                      </span>
                                    ) : null}
                                  </li>
                                  )}
                                </ul>
                              </div>
                              <div className="scorers-box-away">
                                <ul className="scorers-list">
                                  {fixture.assists?.map(
                                    (assist: any, index: any) => (
                                      <li
                                        key={assist.id}
                                        className="scorer-item"
                                        style={{ display: "flex" }}
                                      >
                                        {assist.team === "away" ? (
                                          <span
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {[...Array(assist.value)].map(
                                              (_, i) => (
                                                <FontAwesomeIcon
                                                  key={i}
                                                  icon={faA}
                                                  className="away-icon-assists"
                                                />
                                              )
                                            )}
                                            {assist.name}
                                          </span>
                                        ) : null}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                            {fixture.finished ? (
                              <>
                              <div style={{display:'flex', width:'50%'}}>
                                <div
                                  className="bonus-box"
                                  style={{
                                    display: "flex",
                                    // marginLeft: "60px",
                                    justifyContent:'right',
                                  }}
                                >
                                  <ul
                                    className="bonus-list"
                                    style={{ padding: 0, margin: 0 }}
                                  >
                                    <h6 style={{fontWeight:'bold'}} className="bonus-title">Bonus</h6>
                                    {fixture.bonus?.map(
                                      (bonus: any, index: any) => (
                                        <li key={index} className="bonus-item">
                                          ({bonus.value}) {bonus.name}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                              </>
                            ) : (
                              <>
                              <div style={{justifyContent:'right'}}>
                                <div
                                  className="bonus-box"
                                  style={{
                                    display: "inline-block",
                                  }}
                                >
                                  <ul
                                    className="bonus-list"
                                    style={{ padding: 0, margin: 0 }}
                                  >
                                    <h6 style={{fontWeight:'bold'}} className="bonus-title">Live Bonus</h6>
                                    {fixture.bps?.map((bps: any, index: any) => {
                                      // Calculate points based on tie-breaking rules
                                      let points;
                                      if (index === 0) {
                                        points = 3;
                                      } else if (index === 1) {
                                        if (fixture.bps[0].value === bps.value) {
                                          points = 3;
                                        } else {
                                          points = 2;
                                        }
                                      } else if (index === 2) {
                                        if (fixture.bps[0].value === bps.value) {
                                          points = 3;
                                        } else if (
                                          fixture.bps[1].value === bps.value
                                        ) {
                                          points = 2;
                                        } else {
                                          points = 1;
                                        }
                                      } else {
                                        points = 1; // All remaining players get 1 point
                                      }

                                      // Display bonus points for each player
                                      return (
                                        <li key={index} className="bonus-item">
                                          ({points}) {bps.name} ({bps.value})
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </div>
                              </>
                            )}
                            
                          </div>
                        </div>
                      ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      }
    </>
  );
};

export default DisplayFixtures;
