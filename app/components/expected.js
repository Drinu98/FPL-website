import DisplayExpected from "./DisplayExpected";
import Image from "next/image";

const Expected = async () => {
  try {
    const res = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      {
        next: {
          revalidate: 120,
        },
      }
    );

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    const elementTypes = data.element_types;
    const teams = data.teams;
    const players = data.elements;
    const events = data?.events;

    let gameweekJsonArray = [];
    let previousGameweekJsonArray = [];
    let totalgameweekJsonArray = [];

    const currentGameweekData =
      events?.find((event) => event?.is_current === true) ??
      events?.find((event) => event?.is_next === true) ??
      "Error: ID is undefined.";
    const previousGamweek = events?.find(
      (event) => event?.is_previous === true
    )?.id;
    const currentGameweek = currentGameweekData?.id;

    try {
      const gameweekData = await fetch(
        `https://fantasy.premierleague.com/api/event/${currentGameweek}/live/`,
        {
          next: {
            revalidate: 120,
          },
        }
      );
      const gameweekJson = await gameweekData.json();
      gameweekJsonArray.push({ gameweek: currentGameweek, data: gameweekJson });
      // console.log(gameweekJsonArray);

      // Do something with the gameweek data, such as parsing and displaying it
    } catch (error) {
      console.error(error);
    }

    try {
      const gameweekData = await fetch(
        `https://fantasy.premierleague.com/api/event/${previousGamweek}/live/`,
        {
          next: {
            revalidate: 120,
          },
        }
      );
      const gameweekJson = await gameweekData.json();
      previousGameweekJsonArray.push({
        gameweek: previousGamweek,
        data: gameweekJson,
      });
      // console.log(gameweekJsonArray);

      // Do something with the gameweek data, such as parsing and displaying it
    } catch (error) {
      console.error(error);
    }

    for (let i = 1; i <= currentGameweek; i++) {
      try {
        const gameweekData = await fetch(
          `https://fantasy.premierleague.com/api/event/${i}/live/`,
          {
            next: {
              revalidate: 120,
            },
          }
        );

        if (!gameweekData.ok) {
          throw new Error(`Failed to fetch data for gameweek ${i}`);
        }

        const gameweekJson = await gameweekData.json();
        totalgameweekJsonArray.push({ gameweek: i, data: gameweekJson });

        // Do something with the gameweek data, such as parsing and displaying it
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    // for (let i = currentGameweek; i >= currentGameweek - 6; i--) {
    //   try {
    //     const gameweekData = await fetch(`https://fantasy.premierleague.com/api/event/${i}/live/`, {
    //       next: {
    //         revalidate: 120
    //       },
    //     });

    //     if (!gameweekData.ok) {
    //       throw new Error(`Failed to fetch data for gameweek ${i}`);
    //     }

    //     const gameweekJson = await gameweekData.json();
    //     gameweekJsonArray.push({ gameweek: i, data: gameweekJson });

    //     // Do something with the gameweek data, such as parsing and displaying it
    //   } catch (error) {
    //     console.error(error);

    //     continue;
    //   }
    // }

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

    const expectedGoalsPrevious = previousGameweekJsonArray.reduce(
      (acc, gw) => {
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
      },
      {}
    );

    const expectedGoalsTotal = totalgameweekJsonArray.reduce((acc, gw) => {
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
    const previousGameweekXG = [];
    // Add position and team data to the expectedGoalsByGameweek object
    const gwArray = expectedGoalsByGameweek[currentGameweek];
    gwArray.forEach((gwObj) => {
      const playerObj = players.find((player) => player.id === gwObj.id);
      if (playerObj) {
        const positionObj = elementTypes.find(
          (position) => position.id === playerObj.element_type
        );
        const teamObj = teams.find((team) => team.id === playerObj.team);
        if (positionObj) {
          gwObj.position_short = positionObj.singular_name_short;
          gwObj.position = positionObj.plural_name;
        }
        if (teamObj) {
          gwObj.team = teamObj.short_name;
          gwObj.teamLong = teamObj.name;
        }
        gwObj.name = playerObj.web_name;
        gwObj.cost = (playerObj.now_cost / 10).toFixed(1);
        // delete gwObj.id;
        currentGameweekXG.push(gwObj);
      }
    });

    const previousGwArray = expectedGoalsPrevious[previousGamweek];
    previousGwArray.forEach((gwObj) => {
      const playerObj = players.find((player) => player.id === gwObj.id);
      if (playerObj) {
        const positionObj = elementTypes.find(
          (position) => position.id === playerObj.element_type
        );
        const teamObj = teams.find((team) => team.id === playerObj.team);
        if (positionObj) {
          gwObj.position_short = positionObj.singular_name_short;
          gwObj.position = positionObj.plural_name;
        }
        if (teamObj) {
          gwObj.team = teamObj.short_name;
          gwObj.teamLong = teamObj.name;
        }
        gwObj.name = playerObj.web_name;
        gwObj.cost = (playerObj.now_cost / 10).toFixed(1);
        // delete gwObj.id;
        previousGameweekXG.push(gwObj);
      }
    });

    const xGTotal = {};
    Object.values(expectedGoalsTotal).forEach((gwArray) => {
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
          xGTotal[playerId].xG = (
            parseFloat(xGTotal[playerId].xG) + parseFloat(gwObj.xG)
          ).toFixed(2);
          xGTotal[playerId].xGA = (
            parseFloat(xGTotal[playerId].xGA) + parseFloat(gwObj.xGA)
          ).toFixed(2);
          xGTotal[playerId].xGI = (
            parseFloat(xGTotal[playerId].xGI) + parseFloat(gwObj.xGI)
          ).toFixed(2);
        }
      });
    });
    // Add position and team data to the xGTotal object
    Object.values(xGTotal).forEach((playerObj) => {
      const playerData = players.find((player) => player.id === playerObj.id);
      if (playerData) {
        const positionObj = elementTypes.find(
          (position) => position.id === playerData.element_type
        );
        const teamObj = teams.find((team) => team.id === playerData.team);
        if (positionObj) {
          playerObj.position_short = positionObj.singular_name_short;
          playerObj.position = positionObj.plural_name;
        }
        if (teamObj) {
          playerObj.team = teamObj.short_name;
          playerObj.teamLong = teamObj.name;
        }
        playerObj.name = playerData.web_name;
        playerObj.cost = (playerData.now_cost / 10).toFixed(1);
        delete playerObj.id;
      }
    });

    // const xGTotalLast4Gameweeks = {};
    // const startGameweek = currentGameweek - 5;
    // const endGameweek = currentGameweek - 1;

    // for (let gw = currentGameweek - 5; gw <= currentGameweek - 1; gw++) {
    //   const gwArray = expectedGoalsTotal[gw];
    //   if (gwArray) {
    //     gwArray.forEach((gwObj) => {
    //       const playerId = gwObj.id;
    //       if (!xGTotalLast4Gameweeks[playerId]) {
    //         xGTotalLast4Gameweeks[playerId] = {
    //           id: playerId,
    //           xG: parseFloat(gwObj.xG).toFixed(3),
    //           xGA: parseFloat(gwObj.xGA).toFixed(3),
    //           xGI: parseFloat(gwObj.xGI).toFixed(3),
    //         };
    //       } else {
    //         xGTotalLast4Gameweeks[playerId].xG = (parseFloat(xGTotalLast4Gameweeks[playerId].xG) + parseFloat(gwObj.xG)).toFixed(1);
    //         xGTotalLast4Gameweeks[playerId].xGA = (parseFloat(xGTotalLast4Gameweeks[playerId].xGA) + parseFloat(gwObj.xGA)).toFixed(1);
    //         xGTotalLast4Gameweeks[playerId].xGI = (parseFloat(xGTotalLast4Gameweeks[playerId].xGI) + parseFloat(gwObj.xGI)).toFixed(2);
    //       }
    //     });
    //   }
    // }

    function calculateTotalExpectedGoalsInRange(expectedGoalsTotal, startGameweek, endGameweek) {
      const xGTotalRange = {};
    
      for (let gw = startGameweek; gw <= endGameweek; gw++) {
        const gwArray = expectedGoalsTotal[gw];
        if (gwArray) {
          gwArray.forEach((gwObj) => {
            const playerId = gwObj.id;
            if (!xGTotalRange[playerId]) {
              xGTotalRange[playerId] = {
                id: playerId,
                xG: parseFloat(gwObj.xG).toFixed(3),
                xGA: parseFloat(gwObj.xGA).toFixed(3),
                xGI: parseFloat(gwObj.xGI).toFixed(3),
              };
            } else {
              xGTotalRange[playerId].xG = (parseFloat(xGTotalRange[playerId].xG) + parseFloat(gwObj.xG)).toFixed(1);
              xGTotalRange[playerId].xGA = (parseFloat(xGTotalRange[playerId].xGA) + parseFloat(gwObj.xGA)).toFixed(1);
              xGTotalRange[playerId].xGI = (parseFloat(xGTotalRange[playerId].xGI) + parseFloat(gwObj.xGI)).toFixed(2);
            }
          });
        }
      }
    
      return xGTotalRange;
    }

    const xGTotalLast2Gameweeks = calculateTotalExpectedGoalsInRange(expectedGoalsTotal, currentGameweek - 2, currentGameweek - 1);
    const xGTotalLast3Gameweeks = calculateTotalExpectedGoalsInRange(expectedGoalsTotal, currentGameweek - 3, currentGameweek - 1);
    const xGTotalLast4Gameweeks = calculateTotalExpectedGoalsInRange(expectedGoalsTotal, currentGameweek - 4, currentGameweek - 1);
    const xGTotalLast5Gameweeks = calculateTotalExpectedGoalsInRange(expectedGoalsTotal, currentGameweek - 5, currentGameweek - 1);
    const xGTotalLast6Gameweeks = calculateTotalExpectedGoalsInRange(expectedGoalsTotal, currentGameweek - 6, currentGameweek - 1);
    const xGTotalLast7Gameweeks = calculateTotalExpectedGoalsInRange(expectedGoalsTotal, currentGameweek - 7, currentGameweek - 1);
    // for (let gw = startGameweek; gw <= currentGameweek; gw++) {
    //   const gwArray = expectedGoalsByGameweek[gw];
    //   if (gwArray && gwArray.length > 0) {
    //     gwArray.forEach((gwObj) => {
    //       const playerId = gwObj.id;
    //       if (!xGTotalLast4Gameweeks[playerId]) {
    //         xGTotalLast4Gameweeks[playerId] = {
    //           id: playerId,
    //           xG: parseFloat(gwObj.xG).toFixed(3),
    //           xGA: parseFloat(gwObj.xGA).toFixed(3),
    //           xGI: parseFloat(gwObj.xGI).toFixed(3),
    //         };
    //       } else {
    //         xGTotalLast4Gameweeks[playerId].xG = (parseFloat(xGTotalLast4Gameweeks[playerId].xG) + parseFloat(gwObj.xG)).toFixed(1);
    //         xGTotalLast4Gameweeks[playerId].xGA = (parseFloat(xGTotalLast4Gameweeks[playerId].xGA) + parseFloat(gwObj.xGA)).toFixed(1);
    //         xGTotalLast4Gameweeks[playerId].xGI = (parseFloat(xGTotalLast4Gameweeks[playerId].xGI) + parseFloat(gwObj.xGI)).toFixed(2);
    //       }
    //     });
    //   } else {
    //     // Handle the case when gameweek data is not found or empty
    //     console.log(`Gameweek ${gw} data not found.`);
    //     // You can choose to add default values, skip, or perform other actions as per your requirement.
    //   }
    // }

    // Add position and team data to the xGTotalLast4Gameweeks object
      // Object.values(xGTotalLast4Gameweeks).forEach((playerObj) => {
      //   const playerData = players.find((player) => player.id === playerObj.id);
      //   if (playerData) {
      //     const positionObj = elementTypes.find((position) => position.id === playerData.element_type);
      //     const teamObj = teams.find((team) => team.id === playerData.team);
      //     if (positionObj) {
      //       playerObj.position_short = positionObj.singular_name_short;
      //       playerObj.position = positionObj.plural_name;
      //     }
      //     if (teamObj) {
      //       playerObj.team = teamObj.short_name;
      //       playerObj.teamLong = teamObj.name;
      //     }
      //     playerObj.name = playerData.web_name;
      //     playerObj.cost = (playerData.now_cost / 10).toFixed(1);
      //     delete playerObj.id;
      //   }
      // });

      function enrichPlayerData(playerObjects, players, elementTypes, teams) {
        Object.values(playerObjects).forEach((playerObj) => {
          const playerData = players.find((player) => player.id === playerObj.id);
          if (playerData) {
            const positionObj = elementTypes.find((position) => position.id === playerData.element_type);
            const teamObj = teams.find((team) => team.id === playerData.team);
            if (positionObj) {
              playerObj.position_short = positionObj.singular_name_short;
              playerObj.position = positionObj.plural_name;
            }
            if (teamObj) {
              playerObj.team = teamObj.short_name;
              playerObj.teamLong = teamObj.name;
            }
            playerObj.name = playerData.web_name;
            playerObj.cost = (playerData.now_cost / 10).toFixed(1);
            delete playerObj.id;
          }
        });
      }
      
      // Example usage:
    enrichPlayerData(xGTotalLast2Gameweeks, players, elementTypes, teams);
    enrichPlayerData(xGTotalLast3Gameweeks, players, elementTypes, teams);
    enrichPlayerData(xGTotalLast4Gameweeks, players, elementTypes, teams);
    enrichPlayerData(xGTotalLast5Gameweeks, players, elementTypes, teams);
    enrichPlayerData(xGTotalLast6Gameweeks, players, elementTypes, teams);
    enrichPlayerData(xGTotalLast7Gameweeks, players, elementTypes, teams);
    
    const xGTotalLast2GameweeksToArray = Object.values(xGTotalLast2Gameweeks);
    const xGTotalLast3GameweeksToArray = Object.values(xGTotalLast3Gameweeks);
    const xGTotalLast4GameweeksToArray = Object.values(xGTotalLast4Gameweeks);
    const xGTotalLast5GameweeksToArray = Object.values(xGTotalLast5Gameweeks);
    const xGTotalLast6GameweeksToArray = Object.values(xGTotalLast6Gameweeks);
    const xGTotalLast7GameweeksToArray = Object.values(xGTotalLast7Gameweeks);
    const xGTotalToArray = Object.values(xGTotal);
    return (
      <DisplayExpected
        currentGameweekXG={currentGameweekXG}
        previousGameweekXG={previousGameweekXG}
        xGTotalLast2Gameweeks={xGTotalLast2GameweeksToArray}
        xGTotalLast3Gameweeks={xGTotalLast3GameweeksToArray}
        xGTotalLast4Gameweeks={xGTotalLast4GameweeksToArray}
        xGTotalLast5Gameweeks={xGTotalLast5GameweeksToArray}
        xGTotalLast6Gameweeks={xGTotalLast6GameweeksToArray}
        xGTotalLast7Gameweeks={xGTotalLast7GameweeksToArray}
        xGTotal={xGTotalToArray}
      />
    );
  } catch (error) {
    console.error(error);
    return (
      <>
        <div className="transfers-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Expected Data</h2>
          </div>
          <p className="error-message">
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
};

export default Expected;

// // Create a custom sorting function
// const customSort = (a, b) => {

//   // Sort by position
//   if (a.position !== b.position) {
//     return a.position.localeCompare(b.position);
//   }

//   // Sort by xGI
//   return b.xGI - a.xGI;
// };
