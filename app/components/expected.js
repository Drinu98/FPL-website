import DisplayExpected from "./DisplayExpected";
import React from "react";
import Image from "next/image";

async function fetchGameweekData(gameweek) {
  try {
    const response = await fetch(`https://fantasy.premierleague.com/api/event/${gameweek}/live/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for gameweek ${gameweek}`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return null; // Handle the error gracefully
  }
}

function fetchGameweekDataInRange(startGameweek, endGameweek) {
  const promises = [];
  for (let i = startGameweek; i <= endGameweek; i++) {
    promises.push(fetchGameweekData(i));
  }
  return Promise.all(promises);
}

function enrichPlayerData(playerObjects, gameweek, players, elementTypes, teams, teamObject) {
  const gwArray = playerObjects[gameweek];
  gwArray.forEach((playerObj) => {
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
      teamObject.push(playerObj);
    }
  });
}

function enrichPlayerDataTotal(playerObjects, players, elementTypes, teams) {
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
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    const elementTypes = data?.element_types;
    const teams = data?.teams;
    const players = data?.elements;
    const events = data?.events;

    const currentGameweekData = events?.find((event) => event?.is_current === true);

    const previousGamweek = events?.find((event) => event?.is_previous === true)?.id;
    const currentGameweek = currentGameweekData?.id;

    
    const gameweekDataArray = await fetchGameweekDataInRange(1, currentGameweek);
    const previousGameweekData = await fetchGameweekData(previousGamweek);

    const gameweekJsonArray = gameweekDataArray.map((gameweekJson, index) => ({
      gameweek: index + 1,
      data: gameweekJson,
    }));
    const previousGameweekJsonArray = [
      { gameweek: previousGamweek, data: previousGameweekData },
    ];
    
    const totalgameweekJsonArray = await fetchGameweekDataInRange(1, currentGameweek);
    
    const expectedGoalsByGameweek = gameweekJsonArray.reduce((acc, gw) => {
      const elementsArray = gw.data?.elements;
      const expectedGoalsArray = elementsArray.map((el) => ({
        id: el.id,
        xG: el.stats?.expected_goals,
        xGA: el.stats?.expected_assists,
        xGI: el.stats?.expected_goal_involvements,
      }));
      acc[gw.gameweek] = expectedGoalsArray;
      return acc;
    }, {});
    
    const expectedGoalsPrevious = previousGameweekJsonArray.reduce((acc, gw) => {
      const elementsArray = gw.data?.elements;
      const expectedGoalsArray = elementsArray.map((el) => ({
        id: el.id,
        xG: el.stats?.expected_goals,
        xGA: el.stats?.expected_assists,
        xGI: el.stats?.expected_goal_involvements,
      }));
      acc[gw.gameweek] = expectedGoalsArray;
      return acc;
    }, {});
    
    const expectedGoalsTotal = gameweekJsonArray.reduce((acc, gw) => {
      const elementsArray = gw.data?.elements;
      const expectedGoalsArray = elementsArray?.map((el) => ({
        id: el.id,
        xG: el.stats?.expected_goals,
        xGA: el.stats?.expected_assists,
        xGI: el.stats?.expected_goal_involvements,
      }));
      acc[gw.gameweek] = expectedGoalsArray;
      return acc;
    }, {});

    const currentGameweekXG = [];
    const previousGameweekXG = [];
    
    enrichPlayerData(expectedGoalsByGameweek, currentGameweek, players, elementTypes, teams, currentGameweekXG);
    enrichPlayerData(expectedGoalsPrevious,previousGamweek, players, elementTypes, teams, previousGameweekXG);

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

    
    enrichPlayerDataTotal(xGTotal, players, elementTypes, teams);
    
    // const xGTotalLast2Gameweeks = fetchGameweekDataInRange(currentGameweek - 2, currentGameweek - 1);
    // const xGTotalLast3Gameweeks = fetchGameweekDataInRange(currentGameweek - 3, currentGameweek - 1);
    // const xGTotalLast4Gameweeks = fetchGameweekDataInRange(currentGameweek - 4, currentGameweek - 1);
    // const xGTotalLast5Gameweeks = fetchGameweekDataInRange(currentGameweek - 5, currentGameweek - 1);
    // const xGTotalLast6Gameweeks = fetchGameweekDataInRange(currentGameweek - 6, currentGameweek - 1);
    // const xGTotalLast7Gameweeks = fetchGameweekDataInRange(currentGameweek - 7, currentGameweek - 1);

    // const xGTotalLast2GameweeksData = await xGTotalLast2Gameweeks;
    // const xGTotalLast3GameweeksData = await xGTotalLast3Gameweeks;
    // const xGTotalLast4GameweeksData = await xGTotalLast4Gameweeks;
    // const xGTotalLast5GameweeksData = await xGTotalLast5Gameweeks;
    // const xGTotalLast6GameweeksData = await xGTotalLast6Gameweeks;
    // const xGTotalLast7GameweeksData = await xGTotalLast7Gameweeks;

    // const xGTotalLast2GameweeksToArray = Object.values(xGTotalLast2GameweeksData).map((gwObj) => ({
    //   id: gwObj.id,
    //   xG: parseFloat(gwObj.stats?.expected_goals).toFixed(2),
    //   xGA: parseFloat(gwObj.stats?.expected_assists).toFixed(2),
    //   xGI: parseFloat(gwObj.stats?.expected_goal_involvements).toFixed(2),
    // }));
    // const xGTotalLast3GameweeksToArray = xGTotalLast3GameweeksData.map((gwObj) => ({
    //   id: gwObj.id,
    //   xG: parseFloat(gwObj.stats.expected_goals).toFixed(2),
    //   xGA: parseFloat(gwObj.stats.expected_assists).toFixed(2),
    //   xGI: parseFloat(gwObj.stats.expected_goal_involvements).toFixed(2),
    // }));
    // const xGTotalLast4GameweeksToArray = xGTotalLast4GameweeksData.map((gwObj) => ({
    //   id: gwObj.id,
    //   xG: parseFloat(gwObj.stats.expected_goals).toFixed(2),
    //   xGA: parseFloat(gwObj.stats.expected_assists).toFixed(2),
    //   xGI: parseFloat(gwObj.stats.expected_goal_involvements).toFixed(2),
    // }));
    // const xGTotalLast5GameweeksToArray = xGTotalLast5GameweeksData.map((gwObj) => ({
    //   id: gwObj.id,
    //   xG: parseFloat(gwObj.stats.expected_goals).toFixed(2),
    //   xGA: parseFloat(gwObj.stats.expected_assists).toFixed(2),
    //   xGI: parseFloat(gwObj.stats.expected_goal_involvements).toFixed(2),
    // }));
    // const xGTotalLast6GameweeksToArray = xGTotalLast6GameweeksData.map((gwObj) => ({
    //   id: gwObj.id,
    //   xG: parseFloat(gwObj.stats.expected_goals).toFixed(2),
    //   xGA: parseFloat(gwObj.stats.expected_assists).toFixed(2),
    //   xGI: parseFloat(gwObj.stats.expected_goal_involvements).toFixed(2),
    // }));
    // const xGTotalLast7GameweeksToArray = xGTotalLast7GameweeksData.map((gwObj) => ({
    //   id: gwObj.id,
    //   xG: parseFloat(gwObj.stats.expected_goals).toFixed(2),
    //   xGA: parseFloat(gwObj.stats.expected_assists).toFixed(2),
    //   xGI: parseFloat(gwObj.stats.expected_goal_involvements).toFixed(2),
    // }));
    const xGTotalToArray = Object.values(xGTotal).map((gwObj) => ({
      xG: parseFloat(gwObj.xG).toFixed(2),
      xGA: parseFloat(gwObj.xGA).toFixed(2),
      xGI: parseFloat(gwObj.xGI).toFixed(2),
      position_short: gwObj.position_short,
      position: gwObj.position,
      team: gwObj.team,
      teamLong: gwObj.teamLong,
      name: gwObj.name,
      cost: gwObj.cost,
    }));

    // console.log(xGTotalLast2GameweeksToArray);

    return (
      <DisplayExpected
        currentGameweekXG={currentGameweekXG}
        previousGameweekXG={previousGameweekXG}
        // xGTotalLast2Gameweeks={xGTotalLast2GameweeksToArray}
        // xGTotalLast3Gameweeks={xGTotalLast3GameweeksToArray}
        // xGTotalLast4Gameweeks={xGTotalLast4GameweeksToArray}
        // xGTotalLast5Gameweeks={xGTotalLast5GameweeksToArray}
        // xGTotalLast6Gameweeks={xGTotalLast6GameweeksToArray}
        // xGTotalLast7Gameweeks={xGTotalLast7GameweeksToArray}
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


