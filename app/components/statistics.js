import DisplayStatistics from "./DisplayStatistics";

async function getStatistics() {
  try {
    const res = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      {
        next: {
          revalidate: 300,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    const elementTypes = data.element_types;
    const teams = data.teams;
    const players = data.elements;

    const currentGameweekData = players.map((player) => {
      const position = elementTypes.find(
        (type) => type.id === player.element_type
      );
      const team = teams.find((team) => team.code === player.team_code);

      return {
        web_name: player.web_name,
        selected_by_percent: player.selected_by_percent,
        total_points: player.total_points,
        event_points: player.event_points,
        minutes: player.minutes,
        goals: player.goals_scored,
        assists: player.assists,
        clean_sheets: player.clean_sheets,
        goals_conceded: player.goals_conceded,
        own_goals: player.own_goals,
        penalties_saved: player.penalties_saved,
        penalties_missed: player.penalties_missed,
        yellow_cards: player.yellow_cards,
        red_cards: player.red_cards,
        saves: player.saves,
        bonus: player.bonus,
        bps: player.bps,
        influence: player.influence,
        creativity: player.creativity,
        threat: player.threat,
        ict_index: player.ict_index,
        form: player.form,
        dreamteam_count: player.dreamteam_count,
        value_form: player.value_form,
        value_season: player.value_season,
        points_per_game: player.points_per_game,
        transfers_in: player.transfers_in,
        transfers_out: player.transfers_out,
        transfers_in_event: player.transfers_in_event,
        transfers_out_event: player.transfers_out_event,
        cost: (player.now_cost / 10).toFixed(1),
        cost_change_start: player.cost_change_start,
        cost_change_start_fall: player.cost_change_start_fall,
        xGC: player.expected_goals_conceded,
        starts: player.starts,
        photo: `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.photo.replace(
          ".jpg",
          ".png"
        )}`,
        position_short: position ? position.plural_name_short : "",
        position_long: position ? position.plural_name : "",
        team_short: team ? team.short_name : "",
        team: team ? team.name : "",
      };
    });

    return currentGameweekData;
  } catch (error) {
    console.error(error);
  }
}

export default async function Statistics() {
  const playerData = await getStatistics();

  return <DisplayStatistics playerData={playerData} />;
}
