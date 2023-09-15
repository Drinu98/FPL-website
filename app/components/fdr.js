import Image from "next/image";
import DisplayFDR from "./DisplayFDR";

async function getFixtureFDR() {
  const res = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    {
      next: {
        revalidate: 300,
      },
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  const data = await res.json();
  const teams = data.teams;

  // const upcomingGameweek = events?.find((event) => event.is_next === true).id;

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  try {
    const res2 = await fetch(
      `https://fantasy.premierleague.com/api/fixtures?future=1`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    const fixtures = await res2.json();

    if (!fixtures) {
      console.log("The game is being updated");
      res.send("The game is being updated.");
      return;
    }

    const fixturesArray = [];
    for (let fixture of fixtures) {
      const homeTeam = teams.find((team) => team.id === fixture.team_h);
      const awayTeam = teams.find((team) => team.id === fixture.team_a);
      if (!homeTeam || !awayTeam) {
        continue;
      }

      const homeTeamName = homeTeam.name;
      const awayTeamName = awayTeam.name;

      const homeTeamNameShort = homeTeam.short_name;
      const awayTeamNameShort = awayTeam.short_name;

      const homeTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${homeTeam.code}.png`;
      const awayTeamImage = `https://resources.premierleague.com/premierleague/badges/70/t${awayTeam.code}.png`;
      fixturesArray.push({
        event: fixture.event,
        home: homeTeamName,
        homeShort: homeTeamNameShort,
        homeImage: homeTeamImage,
        away: awayTeamName,
        awayShort: awayTeamNameShort,
        awayImage: awayTeamImage,
        homeFdr: fixture.team_h_difficulty,
        awayFdr: fixture.team_a_difficulty,
      });
    }

    const fixturesByDate = {};
    // fixturesArray.forEach(fixture => {
    //     const team = fixture.home;

    //     if(!fixturesByDate[team]){
    //         fixturesByDate[team] = [];
    //     }

    //     fixturesByDate[team]?.push(fixture);
    // })

    const fixturesByTeam = {};

fixturesArray.forEach(fixture => {
    const homeTeam = fixture.home;
    const awayTeam = fixture.away;

    // Group by home team
    if (!fixturesByTeam[homeTeam]) {
        fixturesByTeam[homeTeam] = [];
    }

    fixturesByTeam[homeTeam].push({
        event: fixture.event,
        home: fixture.home,
        fdr: fixture.homeFdr,
        homeImage: fixture.homeImage,
        awayOpponent: fixture.awayShort,
    });

    // Group by away team
    if (!fixturesByTeam[awayTeam]) {
        fixturesByTeam[awayTeam] = [];
    }

    fixturesByTeam[awayTeam].push({
        event: fixture.event,
        away: fixture.away,
        fdr: fixture.awayFdr,
        awayImage: fixture.awayImage,
        homeOpponent: fixture.homeShort,
    });
});

    return fixturesArray;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch fixtures");
  }
}

export default async function FDR() {
  try {
    const data = await getFixtureFDR();
    const fixturesArray = data;
    // console.log(JSON.stringify(fixturesArray, null, 2));
    return <DisplayFDR fixturesArray={fixturesArray}/>;
  } catch (error) {
    console.error(error);
    return (
      <>
        <div className="fixtureTicker-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Fixture Ticker</h2>
          </div>
          <p className="error-message-upcoming">
            <Image
              src="/images/errorlogo.png"
              alt="FPL Focal Logo"
              width={50}
              height={50}
              className="error-logo"
            ></Image>
            The Game is Updating...
          </p>
        </div>
      </>
    );
  }
}
