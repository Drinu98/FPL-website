import DisplayGameweek from "./DisplayGameweek";
import Image from "next/image";

async function getNextGameweek() {
  try {
    const res = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      {
        next: {
          revalidate: 1200,
        },
      }
    );

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    const currentGameweekData = data?.events;

    return currentGameweekData;
  } catch (error) {
    console.error(error);
  }
}

export default async function GameweekInfo() {
  try {
    const gameweeks = await getNextGameweek();

    const currentGameweek = gameweeks.find(
      (gw) => !gw.is_current && gw.is_next
    );

    return (
      // <DisplayGameweek id={currentGameweek.id} deadline_time={currentGameweek.deadline_time} />
      <>
        <DisplayGameweek
          id={currentGameweek.id}
          deadline_time={currentGameweek.deadline_time}
        />
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <>
        <div className="graphic-container-deadline">
          <h2 className="transfers-title">Deadline</h2>
        </div>
        <p className="error-message-gameweek">
          <Image
            src="/images/errorlogo.png"
            alt="FPL Focal Logo"
            width={50}
            height={50}
            className="error-logo"
          ></Image>
          The Game is Updating...
        </p>
      </>
    );
  }
}
