import DisplaySetPieces from "./DisplaySetPieces";
import Image from "next/image";
async function getSetPieces() {
  const playingTeams = [
    {
      Arsenal: [
        { penalties: ["Saka", "Ødegaard", "Havertz", "G.Jesus"] },
        { freeKicks: ["Ødegaard", "Martinelli"] },
        { corners: ["Saka", "Martinelli", "Ødegaard", "Fábio Vieira"] },
      ],
      "Aston Villa": [
        { penalties: ["Douglas Luiz", "Watkins"] },
        { freeKicks: ["Douglas Luiz", "Digne"] },
        { corners: ["Douglas Luiz", "McGinn", "Digne", "Bailey"] },
      ],
      Bournemouth: [
        { penalties: ["Solanke"] },
        { freeKicks: ["Billing", "Tavernier", "Scott"] },
        { corners: ["Tavernier", "Scott", "L.Cook", "Rothwell", "Brooks"] },
      ],
      Brentford: [
        { penalties: ["Toney", "Mbeumo", "Dasilva"] },
        { freeKicks: ["Toney", "Mbeumo", "Jensen"] },
        { corners: ["Mbeumo", "Jensen", "Ghoddos"] },
      ],
      Brighton: [
        { penalties: ["João Pedro", "Gross", "Welbeck"] },
        { freeKicks: ["Dunk", "March", "Gross"] },
        { corners: ["Gross", "March", "Gilmour"] },
      ],
      Chelsea: [
        { penalties: ["Palmer", "Sterling", "N.Jackson", "Enzo"] },
        { freeKicks: ["Enzo", "Palmer", "James", "Chilwell", "Sterling"] },
        { corners: ["Chilwell", "Gallagher", "Palmer", "Mudryk", "Enzo"] },
      ],
      "Crystal Palace": [
        { penalties: ["Eze", "Edouard"] },
        { freeKicks: ["Eze", "Olise", "Edouard"] },
        { corners: ["Eze", "Olise", "Matheus França", "Hughes"] },
      ],
      Everton: [
        { penalties: ["Calvert-Lewin"] },
        { freeKicks: ["Young", "Danjuma", "Garner"] },
        { corners: ["Garner", "McNeil", "Young"] },
      ],
      Fulham: [
        { penalties: ["Andreas", "Wilson"] },
        { freeKicks: ["Wilson", "Willian", "Andreas"] },
        { corners: ["Andreas", "Willian", "Reed"] },
      ],
      Liverpool: [
        { penalties: ["Salah", "Darwin"] },
        { freeKicks: ["Alexander-Arnold", "Szoboszlai", "Virgil", "Salah"] },
        {
          corners: ["Robertson", "Szoboszlai", "Alexander-Arnold", "Tsimikas"],
        },
      ],
      "Man City": [
        { penalties: ["Haaland", "J.Alvarez", "De Bruyne"] },
        { freeKicks: ["De Bruyne", "J.Alvarez", "Haaland"] },
        { corners: ["De Bruyne", "J.Alvarez", "Foden", "Grealish"] },
      ],
      "Man Utd": [
        { penalties: ["B.Fernandes", "Martial", "Rashford"] },
        { freeKicks: ["B.Fernandes", "Rashford", "Eriksen"] },
        { corners: ["Shaw", "B.Fernandes", "Eriksen", "Mount"] },
      ],
      Newcastle: [
        { penalties: ["Wilson", "Isak", "Joelinton"] },
        { freeKicks: ["Trippier", "Schär"] },
        { corners: ["Trippier", "Gordon"] },
      ],
      "Nott'm Forest": [
        { penalties: ["Gibbs-White"] },
        { freeKicks: ["Gibbs-White", "Williams"] },
        { corners: ["Gibbs-White", "Williams", "Hudson-Odoi"] },
      ],
      Spurs: [
        { penalties: ["Son", "Maddison", "Richarlison"] },
        { freeKicks: ["Pedro Porro", "Maddison", "Son", "Bissouma"] },
        { corners: ["Maddison", "Kulusevski", "Pedro Porro"] },
      ],
      "West Ham": [
        { penalties: ["Benrahma", "L.Paquetá", "Bowen"] },
        { freeKicks: ["Ward-Prowse", "Benrahma"] },
        { corners: ["Ward-Prowse", "Bowen", "Cresswell"] },
      ],
      Wolves: [
        { penalties: ["Cunha", "Hee Chan"] },
        { freeKicks: ["Sarabia", "Neto", "Doyle"] },
        { corners: ["Neto", "Doyle", "Sarabia"] },
      ],
    },
  ];

  try {
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

    const teams = data.teams;
    const setPieces = data2.teams;

    const currentGameweekData = setPieces?.map((player) => {
      const team = teams.find((team) => team.id === player.id);
      const teamName = team.name;

      const teamData = playingTeams.find((team) => team[teamName]);

      const penalties =
        teamData[teamName].find((data) => data.penalties)?.penalties || [];
      const freeKicks =
        teamData[teamName].find((data) => data.freeKicks)?.freeKicks || [];
      const corners =
        teamData[teamName].find((data) => data.corners)?.corners || [];

      return {
        team: team.name,
        penalties: penalties,
        freeKicks: freeKicks,
        corners: corners,
        notes: player.notes,
      };
    });

    console.log(currentGameweekData);
    return currentGameweekData;

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
  
}

export default async function SetPieces() {
  const data = await getSetPieces();

  return <DisplaySetPieces setPieces={data} />;
}
