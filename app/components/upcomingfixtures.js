import Image from "next/image";
import DisplayUpcomingFixtures from "./DisplayUpcomingFixtures";

async function getUpcomingFixtures() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
      next: {
        revalidate: 300
      },
    });
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
    

    const res2  = await fetch(`https://fantasy.premierleague.com/api/fixtures?event=${upcomingGameweek}`, 
    {
      next: {
        revalidate: 300
      },
    });

    
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

          const homeTeamName = homeTeam.name;
          const awayTeamName = awayTeam.name;

          const homeTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${homeTeam.code}.png`;
          const awayTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${awayTeam.code}.png`;
          fixturesArray.push({
            home: homeTeamName,
            homeImage: homeTeamImage,
            away: awayTeamName,
            awayImage: awayTeamImage,
            date: fixture.kickoff_time
          });

      
    }

    return fixturesArray;
  }


  export default async function UpcomingFixtures(){
    const fixturesArray = await getUpcomingFixtures();

    return <DisplayUpcomingFixtures fixturesArray={fixturesArray} />
  }