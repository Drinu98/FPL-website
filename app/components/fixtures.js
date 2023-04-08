async function getFixtures() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      next: {
        revalidate: 20
      },
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    const data = await res.json();
    const events = data.events;
    const teams = data.teams;
    const elements = data.elements;
    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
  
    const currentGameweek = events?.find(event => event.is_current === true).id;
    

    const res2  = await fetch(`https://fantasy.premierleague.com/api/fixtures?event=${currentGameweek}`, 
    {
      next: {
        revalidate: 20
      },
    }
  );

    
    const fixtures = await res2.json();

    

    if (!fixtures) {
        console.log('The game is being updated');
        res.send("The game is being updated.");
        return;
    }
  
    const fixturesArray = [];
    const bonusStatsArray = [];
    const bonusPointsArray = [];
    for (let fixture of Object.values(fixtures)) {
      const homeTeam = teams.find(team => team.id === fixture.team_h);
      const awayTeam = teams.find(team => team.id === fixture.team_a);
      const homeTeamName = homeTeam.name;
      const awayTeamName = awayTeam.name;
      const homeTeamScore = fixture.team_h_score;
      const awayTeamScore = fixture.team_a_score;
      const isFinished = fixture.finished;
      const bonusStats = fixture.stats.filter(stat => stat.identifier === 'bps');
      const bonusPoints = fixture.stats.filter(stat => stat.identifier === 'bonus');

      

      const bonusStatsFiltered = bonusStats.flatMap(obj => {
        const filtered = Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => value.length > 0)
        );
        const home = filtered.h ?? [];
        const away = filtered.a ?? [];
        return [...home, ...away];
      });

      const bonusPointsFiltered = bonusPoints.flatMap(obj => {
        const filtered = Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => value.length > 0)
        );
        const home = filtered.h ?? [];
        const away = filtered.a ?? [];
        return [...home, ...away];
      });
      
      const bonusStatsPlayers = [];
      for (const element of bonusStatsFiltered) {
        const player = elements.find(el => el.id === element.element);
        if (player) {
          bonusStatsPlayers.push({
          name: player.web_name,
          value: element.value
          });
        }
      }

      const bonusPointsPlayers = [];
      for (const element of bonusPointsFiltered) {
        const player = elements.find(el => el.id === element.element);
        if (player) {
          bonusPointsPlayers.push({
          name: player.web_name,
          value: element.value
          });
        }
      }

      bonusStatsPlayers.sort((a, b) => b.value - a.value);
      bonusPointsPlayers.sort((a, b) => b.value - a.value);

      const bonusStatsPlayersList = bonusStatsPlayers.splice(0, 3);

      const deadlineTime = new Date(fixture.kickoff_time);

      const kickOffDate = deadlineTime.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'short',
      });
      const kickOffTime = deadlineTime.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24',
      });

      
      const homeTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${homeTeam.code}.png`;
      const awayTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${awayTeam.code}.png`;
      fixturesArray.push({
        home: homeTeamName,
        homeImage: homeTeamImage,
        away: awayTeamName,
        awayImage: awayTeamImage,
        date: kickOffDate,
        time: kickOffTime,
        started: fixture.started,
        homeScore: homeTeamScore,
        awayScore: awayTeamScore,
        finished: isFinished,
        bps: bonusStatsPlayersList,
        bonus: bonusPointsPlayers
      });
      bonusStatsArray.push(...bonusStatsPlayersList);
      bonusPointsArray.push(...bonusPointsPlayers);

      
    }

    return fixturesArray;
  }


  export default async function Page(){
    const data = await getFixtures();

    
     // sort the fixtures array by date
    const sortedFixtures = data?.sort((a, b) => new Date(a.date) - new Date(b.date));

    // group the fixtures by date using an object
    const fixturesByDate = {};
    sortedFixtures?.forEach(fixture => {
        const date = fixture.date;
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
          <ul className="fixture-ul-list" style={{ padding: 0, margin: 0 }}>
            {/* loop through the fixtures grouped by date */}
            {Object.keys(fixturesByDate).map((date) => (
              <li key={date}>
                <div className="fixture-date-box">
                  <span className="fixture-date-inner-box">
                    <h4 className="fixture-date">{date}</h4>
                  </span>
                </div>
                <ul className="fixture-ul-list">
                  {fixturesByDate[date]?.map((fixture, index) => (
                    <li className="fixture-item" key={index}>
                      <div className="fixture-home-box">
                        <div className="fixture-inner-box">
                          <div className="home-box">
                            <span className="home-text">{fixture.home} </span>
                            <div className="home-image-box">
                              <img
                                className="home-image"
                                src={fixture.homeImage}
                                alt={fixture.home}
                              />
                            </div>
                          </div>
                          {fixture.started ? (
                            <span className="score-box">
                              {fixture.homeScore} - {fixture.awayScore}{" "}
                            </span>
                          ) : (
                            <span className="time-box">{fixture.time}</span>
                          )}
                          <div className="away-box">
                            <div className="away-image-box">
                              <img
                                className="away-image"
                                src={fixture.awayImage}
                                alt={fixture.away}
                              />
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
                                {fixture.bonus?.map((bonus, index) => (
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
                              <ul className="bonus-list" style={{ padding: 0, margin: 0 }}>
                                {fixture.bps?.map((bps, index) => (
                                  <li key={index} className="bonus-item">
                                    ({fixture.bps.length - index}) {bps.name} ({bps.value})   
                                  </li>
                                ))}
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