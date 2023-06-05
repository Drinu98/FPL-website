import DisplayGameweek from "./DisplayGameweek";

async function getNextGameweek() {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
        next: {
          revalidate: 1200
        },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const currentGameweekData = data?.events;

    return currentGameweekData;
}


export default async function GameweekInfo() {

    const gameweeks = await getNextGameweek();

    const currentGameweek = gameweeks.find(gw => !gw.is_current && gw.is_next);

    return (
        // <DisplayGameweek id={currentGameweek.id} deadline_time={currentGameweek.deadline_time} />
        <>
        {currentGameweek ? (
            <DisplayGameweek
              id={currentGameweek.id}
              deadline_time={currentGameweek.deadline_time}
            />
          ) : (
            <p>No upcoming gameweeks.</p>
          )}
        </>
    );

}