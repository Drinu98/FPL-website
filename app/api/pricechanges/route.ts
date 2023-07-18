import { NextResponse } from "next/server";
import { prisma } from "../../../services/prisma";

let risingPlayers = [] as Array<any>
let fallingPlayers = [] as Array<any>

export async function GET(){
  console.log("Gathering Price changes");
  const risers = new Map();
  const fallers = new Map();  
  
  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');

    const data = await response.json();

    const players = data.elements;
    const teams = data.teams;

    players.filter((player : any) => player.cost_change_event > 0).map((player: any) => {
    const team = teams.find((team : any) => team.code === player.team_code);
    const id = player.id;

    risers.set(
      id, 
      {
        name: player.web_name,
        cost: (player.now_cost / 10).toFixed(1), 
        team: team ? team.short_name : ''
      })
    });

    players.filter((player : any) => player.cost_change_event_fall > 0).map((player : any) => {
    const team = teams.find((team : any) => team.code === player.team_code);
    const id = player.id;

    fallers.set(
      id, 
      {
        name: player.web_name,
        cost: (player.now_cost / 10).toFixed(1), 
        team: team ? team.short_name : ''
      }) 
    });

  risingPlayers = Array.from(risers.entries()).map(
    ([id,{name, cost, team }]) => {
      return {
        id,
        name,
        cost,
        team,
      };
    }
  );

  fallingPlayers = Array.from(fallers.entries()).map(
    ([id,{name, cost, team }]) => {
      return {
        id,
        name,
        cost,
        team,
      };
    }
  );

  const previousPriceChanges = await prisma.priceChanges.findMany({});



// const newRisingPlayers = risingPlayers.filter((risingPlayer) => {
//   // Check if the player's ID exists in oldRisers array
//   const exists = previousPriceChanges.some((oldRiser) => oldRiser.playerElementId === risingPlayer.id);

//   // Return false to remove the player from risingPlayers array
//   return !exists;
// });

const newRisingPlayers = risingPlayers.filter((risingPlayer) => {
  // Check if the player's ID exists in oldRisers array
  const matchingOldRiser = previousPriceChanges.find((oldRiser) => oldRiser.playerElementId === risingPlayer.id);

  // Return true if player's ID does not exist in oldRisers or the cost is different
  return !matchingOldRiser || matchingOldRiser.cost !== risingPlayer.cost;
});

const newFallingPlayers = fallingPlayers.filter((fallingPlayer) => {
  // Check if the player's ID exists in oldRisers array
  const matchingOldFaller = previousPriceChanges.find((oldFaller) => oldFaller.playerElementId === fallingPlayer.id);

  // Return true if player's ID does not exist in oldRisers or the cost is different
  return !matchingOldFaller || matchingOldFaller.cost !== fallingPlayer.cost;
});



// const newFallingPlayers = fallingPlayers.filter((fallingPlayer) => {
//   // Check if the player's ID exists in oldFallers array
//   const exists = previousPriceChanges.some((oldFaller) => oldFaller.playerElementId === fallingPlayer.id);

//   // Return false to remove the player from fallingPlayers array
//   return !exists;
// });
  
  await prisma.$transaction(async ($tx) => {
    await Promise.all([
      $tx.priceChangesIncrease.deleteMany(),
      $tx.priceChangesDecrease.deleteMany(),
      $tx.priceChanges.deleteMany(),    
    ]);
    await Promise.all([
      $tx.priceChangesIncrease.createMany({
        data: [
          ...newRisingPlayers.map((item) => {
            return {
              playerElementId: item.id,
              name: item.name,
              cost: item.cost,
              team: item.team
            }
          })
        ]       
      }),
      $tx.priceChangesDecrease.createMany({
        data: [
          ...newFallingPlayers.map((item) => {
            return {
              playerElementId: item.id,
              name: item.name,
              cost: item.cost,
              team: item.team
            }
          })
        ]
      }),
    ]);
    await $tx.priceChanges.createMany({
      data: [
        ...risingPlayers.map((item) => {
          return {
            playerElementId: item.id,
            name: item.name,
            cost: item.cost,
            team: item.team,
            type: "riser",
          };
        }),
        ...fallingPlayers.map((item) => {
          return {
            playerElementId: item.id,
            name: item.name,
            cost: item.cost,
            team: item.team,
            type: "faller",
          };
        }),
      ],
    })
  });

  console.log("Price changes successfully gathered");

  return new NextResponse(JSON.stringify({ message: 'Price changes Successful'}));
}