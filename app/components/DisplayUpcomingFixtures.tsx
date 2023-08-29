"use client";

import Image from "next/image";

type Fixture = {
  home: string;
  homeImage: string;
  away: string;
  awayImage: string;
  date: string;
};

type DisplayUpcomingFixturesProps = {
  fixturesArray: Array<Fixture>;
};

const DisplayUpcomingFixtures = (props: DisplayUpcomingFixturesProps) => {
  const { fixturesArray } = props;

  const formattedFixtures: any = fixturesArray.map((fixture) => {
    const deadlineTime = new Date(fixture.date);

    const kickOffDate = deadlineTime.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "short",
    });
    const kickOffTime = deadlineTime.toLocaleString("en-GB", {
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h24",
    });

    return {
      ...fixture,
      kickOffDate: kickOffDate,
      time: kickOffTime,
    };
  });

  const sortedFixtures = formattedFixtures?.sort(
    (a: any, b: any) => Date.parse(a.date) - Date.parse(b.date)
  );

  // group the fixtures by date using an object
  const fixturesByDate: { [key: string]: any } = {};

  sortedFixtures?.forEach((fixture: any) => {
    const date = fixture.kickOffDate;

    if (!fixturesByDate[date]) {
      fixturesByDate[date] = [];
    }

    fixturesByDate[date]?.push(fixture);
  });

  return (
    <>
      <div className="fixture-container">
        <div className="graphic-container">
          <h2 className="transfers-title">Fixtures</h2>
        </div>
        <ul
          className="upcomingfixture-ul-list"
          style={{ padding: 0, margin: 0 }}
        >
          {/* loop through the fixtures grouped by date */}
          {Object.keys(fixturesByDate)?.map((date) => (
            <li key={date}>
              <div className="upcomingfixture-date-box">
                <span className="upcomingfixture-date-inner-box">
                  <h4 className="upcomingfixture-date">{date}</h4>
                </span>
              </div>
              <ul className="upcomingfixture-ul-list">
                {fixturesByDate[date]?.map((fixture: any, index: any) => (
                  <li className="fixture-item" key={index}>
                    <div className="upcomingfixture-home-box">
                      <div className="upcomingfixture-inner-box">
                        <div className="home-box-2">
                          <span className="upcomingfixture-home-text">
                            {fixture.home}{" "}
                          </span>
                          <div className="upcomingfixture-home-image-box">
                            <Image
                              className="home-image"
                              src={fixture.homeImage}
                              alt={fixture.home}
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                        <span className="upcomingfixture-score-box">
                          {" "}
                          {fixture.time}{" "}
                        </span>
                        <div className="away-box-2">
                          <div className="upcomingfixture-away-image-box">
                            <Image
                              className="away-image"
                              src={fixture.awayImage}
                              alt={fixture.away}
                              width={40}
                              height={40}
                            />
                          </div>
                          <span className="upcomingfixture-away-text">
                            {fixture.away}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DisplayUpcomingFixtures;
