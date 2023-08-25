"use client"

import Image from "next/image"

type Fixture = {
    home: string
    homeImage: string
    away: string
    awayImage: string
    date: string
    started: boolean
    homeScore: number
    awayScore: number
    finished: boolean
    bps: Array<any>
    bonus: Array<any>
    
}

type DisplayFixturesProps = {
    fixturesArray: Array<Fixture>
}

const DisplayFixtures = (props: DisplayFixturesProps) => {
    const{fixturesArray} = props

    const formattedFixtures: any = fixturesArray.map(fixture => {
        const deadlineTime = new Date(fixture.date);
    
        const kickOffDate = deadlineTime.toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'short',
        });
        const kickOffTime = deadlineTime.toLocaleString('en-GB', {
          hour: 'numeric',
          minute: 'numeric',
          hourCycle: 'h23',
        });
    
        return {
          ...fixture,
          kickOffDate: kickOffDate,
          time: kickOffTime,
        };
      });
    
      const sortedFixtures = formattedFixtures?.sort((a: any, b: any) => Date.parse(a.date) - Date.parse(b.date));

    // group the fixtures by date using an object
    const fixturesByDate: { [key: string]: any } = {};

    sortedFixtures?.forEach((fixture: any) => {
      const date = fixture.kickOffDate;
    
      if (!fixturesByDate[date]) {
        fixturesByDate[date] = [];
      }
    
      fixturesByDate[date]?.push(fixture);
    });


return(
        <>{
        <div className="fixture-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Bonus Points</h2>
          </div>
          <ul className="fixture-ul-list" style={{ padding: 0, margin: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {/* loop through the fixtures grouped by date */}
            {Object.keys(fixturesByDate).map((date) => (
              <li key={date}>
                <div className="fixture-date-box">
                  <span className="fixture-date-inner-box">
                    <h4 className="fixture-date">{date}</h4>
                  </span>
                </div>
                <ul className="fixture-ul-list">
                  {fixturesByDate[date]?.map((fixture : any, index : any) => (
                    <li className="fixture-item" key={index}>
                      <div className="fixture-home-box">
                        <div className="fixture-inner-box">
                          <div className="home-box">
                            <span className="home-text">{fixture.home} </span>
                            <div className="home-image-box">
                            <Image className="home-image" src={fixture.homeImage} alt={fixture.home} width={40} height={40}/>
                            </div>
                          </div>
                          {fixture.started ? (
                            <>
                              <span className="score-box">
                                {fixture.homeScore} - {fixture.awayScore}{" "}
                              </span>
                              {/* <span className='minutes'>
                                  {fixture.finished && 'FT'}
                              </span> */}
                            </>
                          ) : (
                            <span className="time-box">{fixture.time}</span>
                          )}
                          <div className="away-box">
                            <div className="away-image-box">
                            <Image className="away-image" src={fixture.awayImage} alt={fixture.away} width={40} height={40}/>
                            </div>
                            <span className="away-text">{fixture.away} </span>
                          </div>
                          {fixture.finished ? (
                            <div
                              className="bonus-box"
                              style={{
                                display: "inline-block",
                                marginLeft: "10px",
                              }}
                            >
                              <ul className="bonus-list" style={{ padding: 0, margin: 0 }}>
                                {fixture.bonus?.map((bonus : any, index : any) => (
                                  <li key={index} className="bonus-item">
                                    ({bonus.value}) {bonus.name} 
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div
                              className="bonus-box"
                              style={{
                                display: "inline-block",
                                marginLeft: "10px",
                              }}
                            >
                              {/* <ul className="bonus-list" style={{ padding: 0, margin: 0 }}>
                                {fixture.bps?.map((bps : any, index : any) => (
                                  <li key={index} className="bonus-item">
                                    ({fixture.bps.length - index}) {bps.name} ({bps.value})   
                                  </li>
                                ))}
                              </ul> */}
                              <ul className="bonus-list" style={{ padding: 0, margin: 0 }}>
                              {fixture.bps?.map((bps : any, index : any) => {
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
                                  } else if (fixture.bps[1].value === bps.value) {
                                    points = 2;
                                  } else {
                                    points = 1;
                                  }
                                }else {
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
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        }</>
    )      
}

export default DisplayFixtures