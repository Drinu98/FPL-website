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
    const name = player.web_name;

    risers.set(
      name, 
      {
        cost: (player.now_cost / 10).toFixed(1), 
        team: team ? team.short_name : ''
      })
    });

    players.filter((player : any) => player.cost_change_event_fall > 0).map((player : any) => {
    const team = teams.find((team : any) => team.code === player.team_code);
    const name = player.web_name;

    fallers.set(
      name, 
      {
        cost: (player.now_cost / 10).toFixed(1), 
        team: team ? team.short_name : ''
      }) 
    });

  risingPlayers = Array.from(risers.entries()).map(
    ([name,{cost, team }]) => {
      return {
        name,
        cost,
        team,
      };
    }
  );

  fallingPlayers = Array.from(fallers.entries()).map(
    ([name,{cost, team }]) => {
      return {
        name,
        cost,
        team,
      };
    }
  );

  
  await prisma.$transaction(async ($tx) => {
    await Promise.all([
      $tx.priceChangesIncrease.deleteMany(),
      $tx.priceChangesDecrease.deleteMany(),   
    ]);
    await Promise.all([
      $tx.priceChangesIncrease.createMany({
        data: [
          ...risingPlayers.map((item) => {
            return {
              name: item.name,
              cost: item.cost,
              team: item.team
            }
          })
        ]       
      }),
      $tx.priceChangesDecrease.createMany({
        data: [
          ...fallingPlayers.map((item) => {
            return {
              name: item.name,
              cost: item.cost,
              team: item.team
            }
          })
        ]
      }),
    ]);
  });

  console.log("Price changes successfully gathered");

  return new NextResponse(JSON.stringify({ message: 'ok'}));
}