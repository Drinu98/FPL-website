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

    // const nextGameweek = [currentGameweek.id, currentGameweek.deadline_time];

    // const deadlineTime = new Date(currentGameweek.deadline_time);
    // const deadlineDate = deadlineTime.toLocaleString('en-GB', {
    //     day: 'numeric',
    //     month: 'long',
    //     year: 'numeric',
    //     weekday: 'short',
    // });
    // const startTime = deadlineTime.toLocaleString('en-GB', {
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     hourCycle: 'h12',
    // });

    return (
        // <>
        //     <div className='graphic-container-deadline'>
        //         <h2 className='transfers-title'>Deadline</h2>            
        //     </div>
        //     <div>
        //         <h2 className="deadline-date">Gameweek {currentGameweek.id}</h2>
        //         <p className="deadline-date-time">{deadlineDate} {startTime}</p>
        //     </div>
        // </>
        <DisplayGameweek id={currentGameweek.id} deadline_time={currentGameweek.deadline_time} />
    );

}