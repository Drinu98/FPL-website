import DisplaySetPieces from "./DisplaySetPieces";
import Image from "next/image";
async function getSetPieces() {
  const playingTeams = [
    {
      Arsenal: [
        { penalties: ["Saka", "Ødegaard", "Havertz", "Fábio Vieira"] },
        { freeKicks: ["Ødegaard", "Rice"] },
        { corners: ["Saka", "Rice", "Ødegaard", "Nelson"] },
      ],
      "Aston Villa": [
        { penalties: ["Watkins"] },
        { freeKicks: ["Digne", "McGinn", "Bailey"] },
        { corners: ["McGinn", "Bailey", "Digne"] },
      ],
      Bournemouth: [
        { penalties: ["Solanke"] },
        { freeKicks: ["Philip", "Tavernier", "Scott", "Kluivert"] },
        { corners: ["Tavernier", "Cook", "Scott", "Christie"] },
      ],
      Brentford: [
        { penalties: ["Toney", "Mbeumo", "Dasilva"] },
        { freeKicks: ["Toney", "Mbeumo", "Jensen"] },
        { corners: ["Mbeumo", "Jensen", "Dasilva"] },
      ],
      Brighton: [
        { penalties: ["João Pedro", "Gross", "Welbeck"] },
        { freeKicks: ["Gross", "Dunk", "Welbeck"] },
        { corners: ["Gross", "March", "Estupiñan", "Milner"] },
      ],
      Chelsea: [
        { penalties: ["Palmer", "Enzo", "N.Jackson", "Sterling"] },
        { freeKicks: ["Palmer", "James", "Sterling", "Chilwell", "Enzo"] },
        { corners: ["Chilwell", "Gallagher", "Palmer", "Mudryk", "James"] },
      ],
      "Crystal Palace": [
        { penalties: ["Eze", "Mateta", "Edouard"] },
        { freeKicks: ["Eze", "Edouard"] },
        { corners: ["Eze", "J.Ayew", "Wharton", "Hughes"] },
      ],
      Everton: [
        { penalties: ["Calvert-Lewin"] },
        { freeKicks: ["Young", "Garner"] },
        { corners: ["McNeil", "Garner"] },
      ],
      Fulham: [
        { penalties: ["Andreas", "Wilson"] },
        { freeKicks: ["Andreas", "Wilson"] },
        { corners: ["Andreas", "Wilson"] },
      ],
      Ipswich: [
        { penalties: ["Al-Hamadi", "Hirst"] },
        { freeKicks: ["Broadhead", "Chaplin", "Hutchinson","Davis"] },
        { corners: ["Davis"] },
      ],
      Leicester: [
        { penalties: ["Vardy", "Daka","Mavididi"] },
        { freeKicks: ["Mavididi"] },
        { corners: ["Mavididi"] },
      ],
      Liverpool: [
        { penalties: ["Salah", "Darwin"] },
        { freeKicks: ["Alexander-Arnold", "Szoboszlai", "Virgil", "Salah"] },
        {corners: ["Alexander-Arnold", "Robertson", "Tsimikas", "Szoboszlai", "Mac Allister", "Elliott"],},
      ],
      "Man City": [
        { penalties: ["Haaland", "J.Alvarez", "De Bruyne"] },
        { freeKicks: ["De Bruyne", "J.Alvarez", "Haaland"] },
        { corners: ["De Bruyne", "J.Alvarez", "Foden", "Bernardo"] },
      ],
      "Man Utd": [
        { penalties: ["B.Fernandes", "Rashford"] },
        { freeKicks: ["B.Fernandes", "Rashford", "Eriksen"] },
        { corners: ["B.Fernandes", "Eriksen", "Shaw"] },
      ],
      Newcastle: [
        { penalties: ["Wilson", "Isak", "Gordon"] },
        { freeKicks: ["Trippier", "Schär"] },
        { corners: ["Trippier", "Bruno G."] },
      ],
      "Nott'm Forest": [
        { penalties: ["Gibbs-White"] },
        { freeKicks: ["Gibbs-White", "N.Williams"] },
        { corners: ["Gibbs-White", "Danilo", "N.Williams"] },
      ],
      Southampton: [
        { penalties: ["Armstrong", "Alcaraz"] },
        { freeKicks: ["Smallbone"] },
        { corners: ["Manning", "Smallbone", "Bree"] },
      ],
      Spurs: [
        { penalties: ["Son", "Maddison", "Richarlison"] },
        { freeKicks: ["Pedro Porro", "Maddison", "Højbjerg", "Bissouma"] },
        { corners: ["Maddison", "Kulusevski", "Pedro Porro"] },
      ],
      "West Ham": [
        { penalties: ["Ward-Prowse", "L.Paquetá", "Bowen"] },
        { freeKicks: ["Ward-Prowse"] },
        { corners: ["Ward-Prowse", "Bowen", "Cresswell"] },
      ],
      Wolves: [
        { penalties: ["Hee Chan", "Cunha", "Sarabia"] },
        { freeKicks: ["Sarabia", "Neto", "Doyle"] },
        { corners: ["Neto", "Sarabia", "Doyle"] },
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
