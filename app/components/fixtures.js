import Image from "next/image";
import DisplayFixtures from './DisplayFixtures'
async function getFixtures() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      next: {
        revalidate: 5
      },
    });

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
    // The return value is *not* serialized
    const data = await res.json();
    const events = data.events;
    const teams = data.teams;
    const elements = data.elements

    // const currentGameweek = events?.find(event => event.is_current === true)?.id ?? 'Error: ID is undefined.';
    const currentGameweek = events?.find(event => event.is_current === true)?.id ?? events?.find(event => event.is_next === true)?.id ?? 'Error: ID is undefined.';

    
    try{
      const res2  = await fetch(`https://fantasy.premierleague.com/api/fixtures?event=${currentGameweek}`, 
    {
      next: {
        revalidate: 5
      },
    }
  );

  if (!res2.ok) {
    throw new Error('Failed to fetch fixtures');
  }
    
    const fixtures = await res2.json();

    // if (!fixtures) {
    //     console.log('The game is being updated');
    //     res.send("The game is being updated.");
    //     return;
    // }
  
    const fixturesArray = [];
    const bonusStatsArray = [];
    const bonusPointsArray = [];
    const finalScoringPlayers = [];
    const finalAssistingPlayers = [];
    for (let fixture of Object.values(fixtures)) {
      const homeTeam = teams.find(team => team.id === fixture.team_h);
      const awayTeam = teams.find(team => team.id === fixture.team_a);
      
      if (!homeTeam || !awayTeam) {
        throw new Error('Team data not found');
      }
      
      const homeTeamName = homeTeam.name;
      const awayTeamName = awayTeam.name;
      const homeTeamScore = fixture.team_h_score;
      const awayTeamScore = fixture.team_a_score;
      const isFinished = fixture.finished;
      const bonusStats = fixture.stats.filter(stat => stat.identifier === 'bps');
      const bonusPoints = fixture.stats.filter(stat => stat.identifier === 'bonus');
      const scorers = fixture.stats.filter(stat => stat.identifier === 'goals_scored');
      const assists = fixture.stats.filter(stat => stat.identifier === 'assists');


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

      // const scorersFiltered = scorers.flatMap(obj => {
      //   const filtered = Object.fromEntries(
      //     Object.entries(obj).filter(([key, value]) => value.length > 0)
      //   );
      //   const home = filtered.h ?? [];
      //   const away = filtered.a ?? [];
      //   return [...home, ...away];
      // });
      const scorersFiltered = scorers.flatMap(obj => {
        const filtered = Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => value.length > 0)
        );
        
        const home = filtered.h ?? [];
        const away = filtered.a ?? [];
      
        const homeScorers = home.map(scorer => ({ ...scorer, team: 'home' }));
        const awayScorers = away.map(scorer => ({ ...scorer, team: 'away' }));
      
        return [...homeScorers, ...awayScorers];
      });

      // console.log(scorersFiltered);
      const assistsFiltered = assists.flatMap(obj => {
        const filtered = Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => value.length > 0)
        );
        const home = filtered.h ?? [];
        const away = filtered.a ?? [];

        const homeAssisters = home.map(scorer => ({ ...scorer, team: 'home' }));
        const awayAssisters = away.map(scorer => ({ ...scorer, team: 'away' }));

        return [...homeAssisters, ...awayAssisters];
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

      const scoringPlayers = [];
      for (const element of scorersFiltered) {
        const player = elements.find(el => el.id === element.element);
        if (player) {
          scoringPlayers.push({
          name: player.web_name,
          value: element.value,
          team: element.team,
          });
        }
      }
      // console.log(scoringPlayers);

      const assistingPlayers = [];
      for (const element of assistsFiltered) {
        const player = elements.find(el => el.id === element.element);
        if (player) {
          assistingPlayers.push({
          name: player.web_name,
          value: element.value
          });
        }
      }

      bonusStatsPlayers.sort((a, b) => b.value - a.value);
      bonusPointsPlayers.sort((a, b) => b.value - a.value);

      const bonusStatsPlayersList = bonusStatsPlayers.splice(0, 3);
      
      const homeTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${homeTeam.code}.png`;
      const awayTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${awayTeam.code}.png`;
      fixturesArray.push({
        home: homeTeamName,
        homeImage: homeTeamImage,
        away: awayTeamName,
        awayImage: awayTeamImage,
        date: fixture.kickoff_time,
        started: fixture.started,
        homeScore: homeTeamScore,
        awayScore: awayTeamScore,
        minutes: fixture.minutes,
        finished: isFinished,
        bps: bonusStatsPlayersList,
        bonus: bonusPointsPlayers,
        scorers: scoringPlayers,
        assists: assistingPlayers,
      });
      bonusStatsArray.push(...bonusStatsPlayersList);
      bonusPointsArray.push(...bonusPointsPlayers);
      finalScoringPlayers.push(...scoringPlayers);
      finalAssistingPlayers.push(...assistingPlayers);

      
    }

    return fixturesArray;

    }catch (error) {
      console.error(error);
      throw new Error('Failed to fetch fixtures');
    }
    
  }


  export default async function Fixtures() {
    try {
      const fixturesArray = await getFixtures();

      return (
        <>
          {fixturesArray ? (
            <DisplayFixtures fixturesArray={fixturesArray} />
          ) : (
            <p>No upcoming gameweeks.</p>
          )}
        </>
      );
    } catch (error) {
      console.error(error);
      return <>
        <div className="fixture-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Bonus Points</h2>
          </div>
          <p className='error-message'>
            <Image src="/images/errorlogo.png"
                  alt="FPL Focal Logo"
                  width={50}
                  height={50}
                  className='error-logo'>
            </Image>The Game is Updating...</p>
        </div>
      </>
    }
  }