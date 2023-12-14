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

function mapData(gameweekRange)
{
  const rangeJsonArray = gameweekRange.map((gameweekJson, index) => ({
    gameweek: index + 1,
    data: gameweekJson,
  }));

  return rangeJsonArray;
}

function calculateExpectedGoalsTotal(gameweekJsonArray) {
  return gameweekJsonArray.reduce((acc, gw) => {
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
}

function calculateXG(gameweekData) {
  const xGTotal = {};

  Object.values(gameweekData).forEach((gwArray) => {
    gwArray.forEach((gwObj) => {
      const playerId = gwObj.id;
      const xG = parseFloat(gwObj.xG).toFixed(2);
      const xGA = parseFloat(gwObj.xGA).toFixed(2);
      const xGI = parseFloat(gwObj.xGI).toFixed(2);

      if (!xGTotal[playerId]) {
        xGTotal[playerId] = { id: playerId, xG, xGA, xGI };
      } else {
        xGTotal[playerId].xG = (parseFloat(xGTotal[playerId].xG) + parseFloat(xG)).toFixed(2);
        xGTotal[playerId].xGA = (parseFloat(xGTotal[playerId].xGA) + parseFloat(xGA)).toFixed(2);
        xGTotal[playerId].xGI = (parseFloat(xGTotal[playerId].xGI) + parseFloat(xGI)).toFixed(2);
      }
    });
  });

  return xGTotal;
}

function mapXGTotalToArray(xGTotal) {
  return Object.values(xGTotal).map((gwObj) => ({
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

    const currentGameweek = events?.find((event) => event?.is_current === true)?.id;

    const previousGamweek = events?.find((event) => event?.is_previous === true)?.id;
   
    const gameweekDataArray = await fetchGameweekDataInRange(1, currentGameweek);
    const previousGameweekData = await fetchGameweekData(previousGamweek);

    const gameweekJsonArray = gameweekDataArray.map((gameweekJson, index) => ({
      gameweek: index + 1,
      data: gameweekJson,
    }));

    const previousGameweekJsonArray = [
      { gameweek: previousGamweek, data: previousGameweekData },
    ];
    
    const expectedGoalsByGameweek = calculateExpectedGoalsTotal(gameweekJsonArray);   
    const expectedGoalsPrevious = calculateExpectedGoalsTotal(previousGameweekJsonArray);  
    const expectedGoalsTotal = calculateExpectedGoalsTotal(gameweekJsonArray);

    const currentGameweekXG = [];
    const previousGameweekXG = [];
    
    const xGTotal = calculateXG(expectedGoalsTotal);
    
    enrichPlayerData(expectedGoalsByGameweek, currentGameweek, players, elementTypes, teams, currentGameweekXG);
    enrichPlayerData(expectedGoalsPrevious,previousGamweek, players, elementTypes, teams, previousGameweekXG);
    enrichPlayerDataTotal(xGTotal, players, elementTypes, teams);
    
    const xGTotalLast2Gameweeks = await fetchGameweekDataInRange(currentGameweek - 2, currentGameweek - 1);
    const xGTotalLast3Gameweeks = await fetchGameweekDataInRange(currentGameweek - 3, currentGameweek - 1);
    const xGTotalLast4Gameweeks = await fetchGameweekDataInRange(currentGameweek - 4, currentGameweek - 1);
    const xGTotalLast5Gameweeks = await fetchGameweekDataInRange(currentGameweek - 5, currentGameweek - 1);
    const xGTotalLast6Gameweeks = await fetchGameweekDataInRange(currentGameweek - 6, currentGameweek - 1);
    const xGTotalLast7Gameweeks = await fetchGameweekDataInRange(currentGameweek - 7, currentGameweek - 1);

    const xGTotalLast2GameweeksData = mapData(xGTotalLast2Gameweeks);
    const xGTotalLast3GameweeksData = mapData(xGTotalLast3Gameweeks);
    const xGTotalLast4GameweeksData = mapData(xGTotalLast4Gameweeks);
    const xGTotalLast5GameweeksData = mapData(xGTotalLast5Gameweeks);
    const xGTotalLast6GameweeksData = mapData(xGTotalLast6Gameweeks);
    const xGTotalLast7GameweeksData = mapData(xGTotalLast7Gameweeks);

    const xGTotal2 = calculateExpectedGoalsTotal(xGTotalLast2GameweeksData);
    const xGTotal3 = calculateExpectedGoalsTotal(xGTotalLast3GameweeksData);
    const xGTotal4 = calculateExpectedGoalsTotal(xGTotalLast4GameweeksData);
    const xGTotal5 = calculateExpectedGoalsTotal(xGTotalLast5GameweeksData);
    const xGTotal6 = calculateExpectedGoalsTotal(xGTotalLast6GameweeksData);
    const xGTotal7 = calculateExpectedGoalsTotal(xGTotalLast7GameweeksData);
    
    const xGTotal2Ttoal = calculateXG(xGTotal2);
    const xGTotal3Ttoal = calculateXG(xGTotal3);
    const xGTotal4Ttoal = calculateXG(xGTotal4);
    const xGTotal5Ttoal = calculateXG(xGTotal5);
    const xGTotal6Ttoal = calculateXG(xGTotal6);
    const xGTotal7Ttoal = calculateXG(xGTotal7);

    enrichPlayerDataTotal(xGTotal2Ttoal, players, elementTypes, teams);
    enrichPlayerDataTotal(xGTotal3Ttoal, players, elementTypes, teams);
    enrichPlayerDataTotal(xGTotal4Ttoal, players, elementTypes, teams);
    enrichPlayerDataTotal(xGTotal5Ttoal, players, elementTypes, teams);
    enrichPlayerDataTotal(xGTotal6Ttoal, players, elementTypes, teams);
    enrichPlayerDataTotal(xGTotal7Ttoal, players, elementTypes, teams);

    const xGTotalToArray = mapXGTotalToArray(xGTotal);
    const xGTotalLast2ToArray = mapXGTotalToArray(xGTotal2Ttoal);
    const xGTotalLast3ToArray = mapXGTotalToArray(xGTotal3Ttoal);
    const xGTotalLast4ToArray = mapXGTotalToArray(xGTotal4Ttoal);
    const xGTotalLast5ToArray = mapXGTotalToArray(xGTotal5Ttoal);
    const xGTotalLast6ToArray = mapXGTotalToArray(xGTotal6Ttoal);
    const xGTotalLast7ToArray = mapXGTotalToArray(xGTotal7Ttoal);


    return (
      <DisplayExpected
        currentGameweekXG={currentGameweekXG}
        previousGameweekXG={previousGameweekXG}
        xGTotalLast2Gameweeks={xGTotalLast2ToArray}
        xGTotalLast3Gameweeks={xGTotalLast3ToArray}
        xGTotalLast4Gameweeks={xGTotalLast4ToArray}
        xGTotalLast5Gameweeks={xGTotalLast5ToArray}
        xGTotalLast6Gameweeks={xGTotalLast6ToArray}
        xGTotalLast7Gameweeks={xGTotalLast7ToArray}
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


