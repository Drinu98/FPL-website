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
            <a href="/bonus" className="expand-image-bonus">
              <Image
                alt="expand"
                src={"/images/expand.png"}
                width={20}
                height={20}    
                className="expand-image"
              />
            </a>
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
                            <div>
                              <div className="home-image-box">
                                <span className="home-text">
                                  {fixture.home}
                                </span>
                                <Image
                                  className="home-image"
                                  src={fixture.homeImage}
                                  alt={fixture.home}
                                  width={40}
                                  height={40}
                                />
                              </div>
                              {fixture.started ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "right",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div className="scorers-box-home">
                                    <ul
                                      className="scorers-list"
                                      style={{
                                        // marginBottom: "5px",
                                        marginTop: "15px",
                                      }}
                                    >
                                      {fixture.scorers?.map(
                                        (scorer: any, index: any) => (
                                          <>
                                            <li
                                              key={scorer.id}
                                              className="scorer-item-goals"
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
                                                    marginBottom: "3px",
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
                                      {fixture.ownGoals?.map(
                                        (scorer: any, index: any) => (
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
                                                  marginBottom: "3px",
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
                                        )
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
                                                  marginBottom: "3px",
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
                              ) : null}
                            </div>
                          </div>
                          {fixture.started ? (
                            <>
                              <span className="score-box">
                                {fixture.homeScore} - {fixture.awayScore}{" "}
                                <div
                                  style={{
                                    height: "75%",
                                    width: "1px",
                                    backgroundColor: "rgb(204, 204, 204)",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    marginTop: "15px",
                                  }}
                                ></div>
                              </span>
                            </>
                          ) : (
                            <span className="time-box">{fixture.time}</span>
                          )}
                          <div className="away-box">
                            <div className="outer-away-image-box">
                              <div className="away-image-box">
                                <Image
                                  className="away-image"
                                  src={fixture.awayImage}
                                  alt={fixture.away}
                                  width={40}
                                  height={40}
                                />
                                <span className="away-text">
                                  {fixture.away}{" "}
                                </span>
                              </div>
                              {fixture.started ? (
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "left",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div className="scorers-box-away">
                                      <ul
                                        className="scorers-list"
                                        style={{
                                          // marginBottom: "5px",
                                          marginTop: "15px",
                                        }}
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
                                                    marginBottom: "3px",
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
                                        {fixture.ownGoals?.map(
                                          (scorer: any, index: any) => (
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
                                                    marginBottom: "3px",
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
                                          )
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
                                                    marginBottom: "3px",
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
                                </div>
                              ) : null}
                            </div>
                            {fixture.started ? (
                              <div style={{ width: "50%" }}>
                                <div
                                  className="bonus-box"
                                  style={{
                                    display: "flex",
                                    // justifyContent: "right",
                                  }}
                                >
                                  <ul
                                    className="bonus-list"
                                    style={{ padding: 0, margin: 0 }}
                                  >
                                    {fixture.finished ? (
                                      <>
                                        <div>
                                          <h6
                                            style={{
                                              fontWeight: "bold",
                                            }}
                                            className="bonus-title"
                                          >
                                            <Image
                                              className="bonus-cup"
                                              src={"/images/cup.png"}
                                              alt={"Cup"}
                                              width={27}
                                              height={27}
                                              style={{ marginRight: "5px" }}
                                            />
                                            Bonus
                                          </h6>
                                        </div>

                                        {fixture.bonus?.map(
                                          (bonus: any, index: any) => (
                                            <li
                                              key={index}
                                              className="bonus-item"
                                            >
                                              {bonus.value === 3 && (
                                                <Image
                                                  className="bonus-number"
                                                  src={"/images/three.png"}
                                                  alt={fixture.away}
                                                  width={18}
                                                  height={18}
                                                  style={{
                                                    marginRight: "3px",
                                                  }}
                                                />
                                              )}
                                              {bonus.value === 2 && (
                                                <Image
                                                  className="bonus-number"
                                                  src={"/images/2.png"}
                                                  alt={fixture.away}
                                                  width={18}
                                                  height={18}
                                                  style={{
                                                    marginRight: "3px",
                                                  }}
                                                />
                                              )}
                                              {bonus.value === 1 && (
                                                <Image
                                                  className="bonus-number"
                                                  src={"/images/1.png"}
                                                  alt={fixture.away}
                                                  width={18}
                                                  height={18}
                                                  style={{ marginRight: "3px" }}
                                                />
                                              )}
                                              {bonus.name}
                                            </li>
                                          )
                                        )}
                                      </>
                                    ) : (
                                      // Render live bonus points during the match
                                      <>
                                        <h6
                                          style={{ fontWeight: "bold" }}
                                          className="bonus-title"
                                        >
                                          <Image
                                            className="bonus-cup"
                                            src={"/images/cup.png"}
                                            alt={"Cup"}
                                            width={27}
                                            height={27}
                                            style={{ marginRight: "5px" }}
                                          />
                                          Live Bonus
                                        </h6>
                                        {fixture.bps?.map(
                                          (bps: any, index: any) => {
                                            // Calculate points based on tie-breaking rules
                                            let points;

                                            for (
                                              let i = 0;
                                              i < fixture.bps.length;
                                              i++
                                            ) {
                                              if (index === 0) {
                                                points = 3;
                                              } else {
                                                if (
                                                  bps.value ===
                                                  fixture.bps[0].value
                                                ) {
                                                  // If equal to the first entry, assign 3 points
                                                  points = 3;
                                                } else if (
                                                  bps.value ===
                                                  fixture.bps[1].value
                                                ) {
                                                  // If equal to any other entry, assign 2 points
                                                  points = 2;
                                                } else if (
                                                  bps.value ===
                                                  fixture.bps[2].value
                                                ) {
                                                  // If not equal to any entry, assign 1 point
                                                  points = 1;
                                                }
                                                if (points === undefined) {
                                                  return null; // Skip this player in rendering
                                                }
                                              }
                                            }

                                            // Display bonus points for each player
                                            return (
                                              <li
                                                key={index}
                                                className="bonus-item"
                                              >
                                                {points === 3 && (
                                                  <Image
                                                    className="bonus-number"
                                                    src={"/images/three.png"}
                                                    alt={fixture.away}
                                                    width={18}
                                                    height={18}
                                                    style={{
                                                      marginRight: "3px",
                                                    }}
                                                  />
                                                )}
                                                {points === 2 && (
                                                  <Image
                                                    className="bonus-number"
                                                    src={"/images/2.png"}
                                                    alt={fixture.away}
                                                    width={18}
                                                    height={18}
                                                    style={{
                                                      marginRight: "3px",
                                                    }}
                                                  />
                                                )}
                                                {points === 1 && (
                                                  <Image
                                                    className="bonus-number"
                                                    src={"/images/1.png"}
                                                    alt={fixture.away}
                                                    width={18}
                                                    height={18}
                                                    style={{
                                                      marginRight: "3px",
                                                    }}
                                                  />
                                                )}
                                                {bps.name} ({bps.value})
                                              </li>
                                            );
                                          }
                                        )}
                                      </>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
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
