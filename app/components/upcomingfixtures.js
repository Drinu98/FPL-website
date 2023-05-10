import Image from "next/image";

async function getUpcomingFixtures() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    const data = await res.json();
    const events = data.events;
    const teams = data.teams;

    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
  
    const upcomingGameweek = events?.find(event => event.is_current === false && event.is_next === true).id;
    

    const res2  = await fetch(`https://fantasy.premierleague.com/api/fixtures?event=${upcomingGameweek}`);

    
    const fixtures = await res2.json();

    

    if (!fixtures) {
        console.log('The game is being updated');
        res.send("The game is being updated.");
        return;
    }
  
    const fixturesArray = [];
        for (let fixture of Object.values(fixtures)) {
          const homeTeam = teams.find(team => team.id === fixture.team_h);
          const awayTeam = teams.find(team => team.id === fixture.team_a);
          if (!homeTeam || !awayTeam) {
            continue;
          }
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

          const homeTeamName = homeTeam.name;
          const awayTeamName = awayTeam.name;

          const homeTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${homeTeam.code}.png`;
          const awayTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${awayTeam.code}.png`;
          fixturesArray.push({
            home: homeTeamName,
            homeImage: homeTeamImage,
            away: awayTeamName,
            awayImage: awayTeamImage,
            date: kickOffDate,
            time: kickOffTime
          });

      
    }

    return fixturesArray;
  }


  export default async function UpcomingFixtures(){
    const data = await getUpcomingFixtures();

    
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

    return (
        <>
          <div className='fixture-container'>
            <div className='graphic-container'>
              <h2 className='transfers-title'>Upcoming Fixtures</h2>
            </div>
            <ul className='upcomingfixture-ul-list' style={{padding: 0, margin: 0}}>
              {/* loop through the fixtures grouped by date */}
              {Object.keys(fixturesByDate)?.map(date => (
                <li key={date}>
                  <div className='upcomingfixture-date-box'>
                    <span className='upcomingfixture-date-inner-box'>
                      <h4 className='upcomingfixture-date'>{date}</h4>
                    </span>
                  </div>
                  <ul className='upcomingfixture-ul-list'>
                    {fixturesByDate[date]?.map((fixture, index) => (
                      <li className='fixture-item' key={index}>
                        <div className='upcomingfixture-home-box'>
                          <div className='upcomingfixture-inner-box'>
                            <div className='home-box-2'>
                              <span className='upcomingfixture-home-text'>
                                {fixture.home}{" "}
                              </span>
                              <div className='upcomingfixture-home-image-box'>
                              <Image className="home-image" src={fixture.homeImage} alt={fixture.home} width={40} height={40}/>
                              </div>
                            </div>
                            <span className='upcomingfixture-score-box'> {fixture.time} </span>   
                            <div className='away-box-2'>
                              <div className='upcomingfixture-away-image-box'>
                                <Image className="away-image" src={fixture.awayImage} alt={fixture.away} width={40} height={40}/>
                              </div>
                              <span className='upcomingfixture-away-text'>
                                {fixture.away}{" "}
                              </span>
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
        </>
      );
  }