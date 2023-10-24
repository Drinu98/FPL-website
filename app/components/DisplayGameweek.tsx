"use client";

type DisplayGameweekProps = {
  id: number;
  deadline_time: string;
};

const DisplayGameweek = (props: DisplayGameweekProps) => {
  const { id, deadline_time } = props;

  //changing to local time depending on PC
  const deadlineTime = new Date(deadline_time);
  const deadlineDate = deadlineTime.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "short",
  });
  const startTime = deadlineTime.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12",
  });

  return (
    <>
      <div className="graphic-container-deadline">
        <h2 className="transfers-title">Deadline</h2>
      </div>
      <div>
        <h2 className="deadline-date">Gameweek {id}</h2>
        <p className="deadline-date-time">
          {deadlineDate} {startTime}
        </p>
      </div>
    </>
  );
};

export default DisplayGameweek;
