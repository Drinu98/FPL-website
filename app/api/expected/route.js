import { NextResponse } from 'next/server';

// export async function GET() {
//     const res = await fetch('https://fantasy.premierleague.com/api/event/31/live/', {
//       next: {
//         revalidate: 1
//       },
//     });
  
//     const data = await res.json();
  
//     if (!res.ok) {
//       // This will activate the closest `error.js` Error Boundary
//       throw new Error('Failed to fetch data');
//     }
  
//     const players = data.elements;
  
//     const currentGameweekData = players.map(player => {
//     //   const position = elementTypes.find(type => type.id === player.element_type);
//     //   const team = teams.find(team => team.code === player.team_code);
  
//       return {
//         id: player.id,
//         xG: player.stats.expected_goals,
//         xA: player.stats.expected_assists,
//         // photo: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace(".jpg", ".png")}`,
//         xGI: player.stats.expected_goal_involvements,
//       };
//     });
  
//     currentGameweekData.sort((a, b) => b.xGI - a.xGI);

//     const topXGPlayers = currentGameweekData.slice(0, 10);
//     // Sort the players by teamLong
//     // const sortedData = currentGameweekData.sort((a, b) => {
//     //   if (a.teamLong < b.teamLong) {
//     //     return -1;
//     //   }
//     //   if (a.teamLong > b.teamLong) {
//     //     return 1;
//     //   }
//     //   return 0;
//     // });
  
//     // // Group the players by teamLong
//     // const groupedData = {};
//     // sortedData.forEach(player => {
//     //   if (!groupedData[player.teamLong]) {
//     //     groupedData[player.teamLong] = [];
//     //   }
//     //   groupedData[player.teamLong].push(player);
//     // });
  
//     return NextResponse.json({ topXGPlayers });
//   }
  
export async function GET() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      next: {
        revalidate: 1
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
  
    const elementTypes = data.element_types;
    const teams = data.teams;
    const players = data.elements;
    const events = data?.events;

    let gameweekJsonArray = [];

    const currentGameweekData = events?.find(event => event?.is_current === true);
    const currentGameweek = currentGameweekData?.id;

    for (let i = currentGameweek; i >= currentGameweek - 6; i--) {
        const gameweekData = await fetch(`https://fantasy.premierleague.com/api/event/${i}/live/` , {
          next: {
            revalidate: 60
          },
        }
      );
        const gameweekJson = await gameweekData.json();
        gameweekJsonArray.push({gameweek: i, data: gameweekJson});
        
        // Do something with the gameweek data, such as parsing and displaying it
    }

    const expectedGoalsByGameweek = gameweekJsonArray.reduce((acc, gw) => {
        const elementsArray = gw.data.elements;
        const expectedGoalsArray = elementsArray.map((el) => {
          return {
            id: el.id,
            xG: el.stats.expected_goals,
            xGA: el.stats.expected_assists,
            xGI: el.stats.expected_goal_involvements,
          };
        });
        acc[gw.gameweek] = expectedGoalsArray;
        return acc;
      }, {});

    const currentGameweekXG = [];
      // Add position and team data to the expectedGoalsByGameweek object
        const gwArray = expectedGoalsByGameweek[currentGameweek];
        gwArray.forEach((gwObj) => {
        const playerObj = players.find((player) => player.id === gwObj.id);
        if (playerObj) {
            const positionObj = elementTypes.find((position) => position.id === playerObj.element_type);
            const teamObj = teams.find((team) => team.id === playerObj.team);
            if (positionObj) {
            gwObj.position = positionObj.singular_name_short;
            }
            if (teamObj) {
            gwObj.team = teamObj.short_name;
            }
            gwObj.name = playerObj.web_name;
            gwObj.photo = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerObj.photo.replace(".jpg", ".png")}`;
            // delete gwObj.id;
            currentGameweekXG.push(gwObj);
        }
        });
   
    
const xGTotal = {};
Object.values(expectedGoalsByGameweek).forEach((gwArray) => {
  gwArray.forEach((gwObj) => {
    const playerId = gwObj.id;
    if (!xGTotal[playerId]) {
      xGTotal[playerId] = {
        id: playerId,
        xG: parseFloat(gwObj.xG).toFixed(2),
        xGA: parseFloat(gwObj.xGA).toFixed(2),
        xGI: parseFloat(gwObj.xGI).toFixed(2),
      };
    } else {
      xGTotal[playerId].xG = (parseFloat(xGTotal[playerId].xG) + parseFloat(gwObj.xG)).toFixed(1);
      xGTotal[playerId].xGA = (parseFloat(xGTotal[playerId].xGA) + parseFloat(gwObj.xGA)).toFixed(1);
      xGTotal[playerId].xGI = (parseFloat(xGTotal[playerId].xGI) + parseFloat(gwObj.xGI)).toFixed(1);
    }
  });
});
// Add position and team data to the xGTotal object
Object.values(xGTotal).forEach((playerObj) => {
  const playerData = players.find((player) => player.id === playerObj.id);
  if (playerData) {
    const positionObj = elementTypes.find((position) => position.id === playerData.element_type);
    const teamObj = teams.find((team) => team.id === playerData.team);
    if (positionObj) {
      playerObj.position = positionObj.singular_name_short;
    }
    if (teamObj) {
      playerObj.team = teamObj.short_name;
    }
    playerObj.name = playerData.web_name;
    playerObj.photo = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerData.photo.replace(".jpg", ".png")}`;
    delete playerObj.id;
  }
});
const xGTotalLast4Gameweeks = {};
const startGameweek = currentGameweek - 5;
const endGameweek = currentGameweek - 1;

for (let gw = startGameweek; gw <= endGameweek; gw++) {
  const gwArray = expectedGoalsByGameweek[gw];
  if (gwArray) {
    gwArray.forEach((gwObj) => {
      const playerId = gwObj.id;
      if (!xGTotalLast4Gameweeks[playerId]) {
        xGTotalLast4Gameweeks[playerId] = {
          id: playerId,
          xG: parseFloat(gwObj.xG).toFixed(3),
          xGA: parseFloat(gwObj.xGA).toFixed(3),
          xGI: parseFloat(gwObj.xGI).toFixed(3),
        };
      } else {
        xGTotalLast4Gameweeks[playerId].xG = (parseFloat(xGTotalLast4Gameweeks[playerId].xG) + parseFloat(gwObj.xG)).toFixed(1);
        xGTotalLast4Gameweeks[playerId].xGA = (parseFloat(xGTotalLast4Gameweeks[playerId].xGA) + parseFloat(gwObj.xGA)).toFixed(1);
        xGTotalLast4Gameweeks[playerId].xGI = (parseFloat(xGTotalLast4Gameweeks[playerId].xGI) + parseFloat(gwObj.xGI)).toFixed(2);
      }
    });
  }
}

// Add position and team data to the xGTotalLast4Gameweeks object
  Object.values(xGTotalLast4Gameweeks).forEach((playerObj) => {
    const playerData = players.find((player) => player.id === playerObj.id);
    if (playerData) {
      const positionObj = elementTypes.find((position) => position.id === playerData.element_type);
      const teamObj = teams.find((team) => team.id === playerData.team);
      if (positionObj) {
        playerObj.position = positionObj.singular_name_short;
      }
      if (teamObj) {
        playerObj.team = teamObj.short_name;
      }
      playerObj.name = playerData.web_name;
      playerObj.photo = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerData.photo.replace(".jpg", ".png")}`;
      delete playerObj.id;
    }
  });


    return NextResponse.json({currentGameweekXG, xGTotal, xGTotalLast4Gameweeks});
}
  


          