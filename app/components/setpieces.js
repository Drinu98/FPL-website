import DisplaySetPieces from "./DisplaySetPieces";
async function getSetPieces() {

    const playingTeams = [
        {
            "Arsenal":
            [
                {penalties: ["Saka", "Ødegaard", "Havertz", "G.Jesus"]},
                {freeKicks: ["Ødegaard", "Martinelli"]},
                {corners: ["Saka", "Martinelli", "Ødegaard", "Fábio Vieira"]}
            ],
            "Aston Villa":
            [
                {penalties: ["Douglas Luiz", "Watkins"]},
                {freeKicks: ["Douglas Luiz", "Digne"]},
                {corners: ["Douglas Luiz", "McGinn", "Digne", "Bailey"]}
            ],
            "Bournemouth":
            [
                {penalties: ["Solanke"] },
                {freeKicks: ["Billing", "Tavernier", "Scott"]},
                {corners: ["Tavernier", "Scott", "L.Cook", "Rothwell", "Brooks"]}
            ],
            "Brentford":
            [
                {penalties: ["Toney", "Mbeumo", "Dasilva"]},
                {freeKicks: ["Toney", "Mbeumo", "Jensen"]},
                {corners: ["Mbeumo", "Jensen", "Ghoddos"]}
            ],
            "Brighton":
            [
                {penalties: ["João Pedro", "Gross", "Welbeck"]},
                {freeKicks: ["Dunk", "March", "Gross"]},
                {corners: ["Gross", "March", "Gilmour"]}
            ],
            "Burnley":
            [
                {penalties: ["Rodriguez"]},
                {freeKicks: ["Bruun Larsen", "Gudmundsson", "Brownhill"]},
                {corners: ["Brownhill", "M.Trésor", "Gudmundsson", "Zaroury"]}
            ],
            "Chelsea":
            [
                {penalties: ["Palmer", "Sterling", "N.Jackson", "Enzo"]},
                {freeKicks: ["Enzo", "Palmer", "James", "Chilwell", "Sterling"]},
                {corners: ["Chilwell", "Gallagher", "Palmer", "Mudryk", "Enzo"]}
            ],
            "Crystal Palace":
            [
                {penalties: ["Eze", "Edouard"]},
                {freeKicks: ["Eze", "Olise", "Edouard"]},
                {corners: ["Eze", "Olise", "Matheus França", "Hughes"]}
            ],
            "Everton":
            [
                {penalties: ["Calvert-Lewin"]},
                {freeKicks: ["Young", "Danjuma", "Garner"]},
                {corners: ["Garner", "McNeil", "Young"]}
            ],
            "Fulham":
            [
                {penalties: ["Andreas", "Wilson"]},
                {freeKicks: ["Wilson", "Willian", "Andreas"]},
                {corners: ["Andreas", "Willian", "Reed"]}
            ],
            "Liverpool":
            [
                {penalties: ["Salah", "Darwin"]},
                {freeKicks: ["Alexander-Arnold", "Szoboszlai", "Virgil", "Salah"]},
                {corners: ["Robertson", "Szoboszlai", "Alexander-Arnold", "Tsimikas"]}
            ],
            "Luton":
            [
                {penalties: ["Morris", "Adebayo", "Woodrow"]},
                {freeKicks: ["Barkley", "Doughty"]},
                {corners: ["Doughty", "Giles", "Townsend", "Barkley"]}
            ],
            "Man City":
            [
                {penalties: ["Haaland", "J.Alvarez", "De Bruyne"]},
                {freeKicks: ["De Bruyne", "J.Alvarez", "Haaland"]},
                {corners: ["De Bruyne", "J.Alvarez", "Foden", "Grealish"]}
            ],
            "Man Utd":
            [
                {penalties: ["B.Fernandes", "Martial", "Rashford"]},
                {freeKicks: ["B.Fernandes", "Rashford", "Eriksen"]},
                {corners: ["Shaw", "B.Fernandes", "Eriksen", "Mount"]}
            ],
            "Newcastle":
            [
                {penalties: ["Wilson", "Isak", "Joelinton"]},
                {freeKicks: ["Trippier", "Schär"]},
                {corners: ["Trippier", "Gordon"]}
            ],
            "Nott'm Forest":
            [
                {penalties: ["Gibbs-White"]},
                {freeKicks: ["Gibbs-White", "Williams"]},
                {corners: ["Gibbs-White", "Williams", "Hudson-Odoi"]}
            ],
            "Sheffield Utd":
            [
                {penalties: ["McBurnie", "Norwood", "Brewster"]},
                {freeKicks: ["Norwood", "McAtee"]},
                {corners: ["Norwood", "Hamer"]}
            ],
            "Spurs":
            [
                {penalties: ["Son", "Maddison", "Richarlison"]},
                {freeKicks: ["Pedro Porro", "Maddison", "Son", "Bissouma"]},
                {corners: ["Maddison", "Kulusevski", "Pedro Porro"]}
            ],
            "West Ham":
            [
                {penalties: ["Benrahma", "L.Paquetá", "Bowen"]},
                {freeKicks: ["Ward-Prowse", "Benrahma"]},
                {corners: ["Ward-Prowse", "Bowen", "Cresswell"]}
            ],
            "Wolves":
            [
                {penalties: ["Cunha", "Hee Chan"]},
                {freeKicks: ["Sarabia", "Neto", "Doyle"]},
                {corners: ["Neto", "Doyle", "Sarabia"]}
            ],

        }
       
    ];
  const res = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  const res2 = await fetch(
    "https://fantasy.premierleague.com/api/team/set-piece-notes/",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  const data = await res.json();
  const data2 = await res2.json();

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  if (!res2.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const teams = data.teams;
  const setPieces = data2.teams;

  const currentGameweekData = setPieces.map((player) => {

    const team = teams.find((team) => team.id === player.id);
    const teamName = team.name;

    const teamData = playingTeams.find((team) => team[teamName]);

    const penalties = teamData[teamName].find((data) => data.penalties)?.penalties || [];
    const freeKicks = teamData[teamName].find((data) => data.freeKicks)?.freeKicks || [];
    const corners = teamData[teamName].find((data) => data.corners)?.corners || [];
  

    return {
      team: team.name,
      penalties: penalties,
      freeKicks: freeKicks,
      corners: corners,
      notes: player.notes
    };
  });

//   console.log(currentGameweekData);
  return currentGameweekData;
}

export default async function SetPieces() {

  const data = await getSetPieces();

//   console.log(data);

  return <DisplaySetPieces setPieces={data} />;
}
