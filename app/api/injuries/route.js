import { NextResponse } from 'next/server';

export async function GET() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      next: {
        revalidate: 600
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
  
    const currentGameweekData = players.map(player => {
      const position = elementTypes.find(type => type.id === player.element_type);
      const team = teams.find(team => team.code === player.team_code);
  
      return {
        web_name: player.web_name,
        status: player.status,
        news: player.news,
        photo: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace(".jpg", ".png")}`,
        position: position ? position.plural_name_short : '',
        teamShort: team ? team.short_name : '',
        teamLong: team ? team.name : '',
        chanceOfPlaying: player.chance_of_playing_next_round,
        newsAdded: player.news_added,
      };
    });
  
    // Sort the players by teamLong
    const sortedData = currentGameweekData.sort((a, b) => {
      if (a.teamLong < b.teamLong) {
        return -1;
      }
      if (a.teamLong > b.teamLong) {
        return 1;
      }
      return 0;
    });
  
    // Group the players by teamLong
    const groupedData = {};
    sortedData.forEach(player => {
      if (!groupedData[player.teamLong]) {
        groupedData[player.teamLong] = [];
      }
      groupedData[player.teamLong].push(player);
    });
  
    return NextResponse.json({ groupedData });
  }
  