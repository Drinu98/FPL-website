import { NextResponse } from "next/server";
import { prisma } from "../../../../services/prisma";

let risingPlayers = [] as Array<any>;
let fallingPlayers = [] as Array<any>;

export async function GET() {
  console.log("Gathering Price changes");
  const risers = new Map();
  const fallers = new Map();

  const response = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    {
      next: {
        revalidate: 1,
      },
    }
  );

  const data = await response.json();

  const events = data?.events;
  const players = data.elements;
  const teams = data.teams;

  const currentGameweek = events?.find(
    (event: any) => event.is_current === true
  )?.id;

  players
    .filter((player: any) => player.cost_change_event > 0)
    .map((player: any) => {
      const team = teams.find((team: any) => team.code === player.team_code);
      const id = player.id;

      risers.set(id, {
        name: player.web_name,
        cost: (player.now_cost / 10).toFixed(1),
        team: team ? team.short_name : "",
        gameweek: currentGameweek,
      });
    });

  players
    .filter((player: any) => player.cost_change_event_fall > 0)
    .map((player: any) => {
      const team = teams.find((team: any) => team.code === player.team_code);
      const id = player.id;

      fallers.set(id, {
        name: player.web_name,
        cost: (player.now_cost / 10).toFixed(1),
        team: team ? team.short_name : "",
        gameweek: currentGameweek,
      });
    });

  risingPlayers = Array.from(risers.entries()).map(
    ([id, { name, cost, team, gameweek }]) => {
      return {
        id,
        name,
        cost,
        team,
        gameweek,
      };
    }
  );

  fallingPlayers = Array.from(fallers.entries()).map(
    ([id, { name, cost, team, gameweek }]) => {
      return {
        id,
        name,
        cost,
        team,
        gameweek,
      };
    }
  );

  const previousPriceChanges = await prisma.priceChangesGameweek.findMany({});

  const updatedDates = previousPriceChanges.map((dates) => {
    const date = new Date(dates.updatedAt);
    return date.toLocaleDateString("en-GB");
  });

  const previousGameweeks = previousPriceChanges.map((gw) => {
    const gameweek = gw.gameweek;
    return gameweek;
  });

  const currentDate = new Date();
  const todayDate = currentDate.toLocaleDateString("en-GB");

  if (updatedDates.some((dates) => dates === todayDate)) {

    console.log("Dates match!");
    return;
  } else {
    console.log("Dates are different.");
  }

  if(previousGameweeks.some((gw) => gw !== currentGameweek)){
    console.log("The GWs are different!");
    console.log("Deleting from Database");
    await prisma.priceChangesGameweek.deleteMany();
    console.log("Deleted previous gameweek");
  }else{
    console.log("The GWs are the same"); 
  }

  const newRisingPlayers = risingPlayers.filter((risingPlayer) => {
    // Check if the player's ID exists in oldRisers array
    const matchingOldRiser = previousPriceChanges.find(
      (oldRiser) => oldRiser.playerElementId === risingPlayer.id
    );

    // Return true if player's ID does not exist in oldRisers or the cost is different
    return !matchingOldRiser || matchingOldRiser.cost !== risingPlayer.cost;
  });

  const newFallingPlayers = fallingPlayers.filter((fallingPlayer) => {
    // Check if the player's ID exists in oldRisers array
    const matchingOldFaller = previousPriceChanges.find(
      (oldFaller) => oldFaller.playerElementId === fallingPlayer.id
    );

    // Return true if player's ID does not exist in oldRisers or the cost is different
    return !matchingOldFaller || matchingOldFaller.cost !== fallingPlayer.cost;
  });

  try{
    await prisma.$transaction(async ($tx) => {
      await $tx.priceChangesGameweek.createMany({
        data: [
          ...newRisingPlayers.map((item) => {
            return {
              playerElementId: item.id,
              name: item.name,
              cost: item.cost,
              team: item.team,
              type: "riser",
              gameweek: item.gameweek,
            };
          }),
          ...newFallingPlayers.map((item) => {
            return {
              playerElementId: item.id,
              name: item.name,
              cost: item.cost,
              team: item.team,
              type: "faller",
              gameweek: item.gameweek,
            };
          }),
        ],
      });
    });

    return new NextResponse(
      JSON.stringify({ message: "Price changes Successful" })
    );

  }catch(error){
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Price changes Failed" })
    );
  }
   
}
