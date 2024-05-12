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
        revalidate: 0,
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

  const sortedDates = updatedDates.sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

  const earliestDate = new Date(sortedDates.slice(0, 1)[0]);
  const newDate = new Date(earliestDate);
  newDate.setDate(newDate.getDate() + 10);
  const formattedNewDate = newDate.toLocaleDateString("en-GB");

  // const previousGameweeks = previousPriceChanges.map((gw) => {
  //   const gameweek = gw.gameweek;
  //   return gameweek;
  // });

  const currentDate = new Date();
  const todayDate = currentDate.toLocaleDateString("en-GB");

  if (updatedDates.some((dates) => dates === todayDate)) {
    console.log("Dates match!");
    return;
  } else {
    console.log("Dates are different.");
  }

  if(formattedNewDate === todayDate || todayDate > formattedNewDate){
    console.log("Time to refresh the list");
    console.log("Deleting from Database");
    await prisma.priceChangesGameweek.deleteMany();
    console.log("Deleted previous gameweek");
  }else{
    console.log("No Deletion yet"); 
  }

  const newRisingPlayers = risingPlayers.filter((risingPlayer) => {
    // Find the player's previous price change entries and sort them by cost in descending order
    const playerPriceChanges = previousPriceChanges
      .filter((oldRiser) => oldRiser.playerElementId === risingPlayer.id)
      .sort((a:any, b:any) => b.cost - a.cost);
  
    // Return true if player's ID does not exist in oldRisers or
    // the current cost is greater than the highest recorded cost
    return (
      playerPriceChanges.length === 0 ||
      risingPlayer.cost > playerPriceChanges[0].cost
    );
  });
  

  const newFallingPlayers = fallingPlayers.filter((fallingPlayer) => {
    // Find the player's previous price change entries and sort them by cost in descending order
    const playerPriceChanges = previousPriceChanges
      .filter((oldFaller) => oldFaller.playerElementId === fallingPlayer.id)
      .sort((a:any, b:any) => a.cost - b.cost);
  
    // Return true if player's ID does not exist in oldRisers or
    // the current cost is greater than the highest recorded cost
    return (
      playerPriceChanges.length === 0 ||
      fallingPlayer.cost < playerPriceChanges[0].cost
    );
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

    console.log("Price changes Successful.");
    return new NextResponse(
      JSON.stringify({ message: "Price changes Successful" })
    );

  }catch(error){
    console.error(error);
    console.log("Price Changes Failed.");
    return new NextResponse(
      JSON.stringify({ message: "Price changes Failed" })
    );
  }
   
}
