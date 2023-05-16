import DisplayTransfers from './DisplayTransfers'

async function getTransfers() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
      next: {
        revalidate: 300
      },
    }
  );
    
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
            selected_by_percent: player.selected_by_percent,
            total_points: player.total_points,
            transfers_in: player.transfers_in_event,
            transfers_out: player.transfers_out_event,
            cost: (player.now_cost / 10).toFixed(1),
            photo: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace(".jpg", ".png")}`,
            position: position ? position.plural_name_short : '',
            team: team ? team.short_name : '',
          };
        });

        return currentGameweekData;
  }

  export default async function Transfers() {

    const data = await getTransfers();

        const dataSortedByTransfersIn = [...data].sort((a, b) => b.transfers_in - a.transfers_in);

        // create an array sorted by transfers_out
        const dataSortedByTransfersOut = [...data].sort((a, b) => b.transfers_out - a.transfers_out);
        
    
        const topPlayersIn = dataSortedByTransfersIn.slice(0, 10);
        const topPlayersOut = dataSortedByTransfersOut.slice(0, 10);
    
        return (
              <DisplayTransfers topPlayersIn={topPlayersIn} topPlayersOut={topPlayersOut} />
        );
}


