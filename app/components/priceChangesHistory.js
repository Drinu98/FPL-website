import Image from "next/image";
import { prisma } from "../../services/prisma";

async function getPriceChanges() {
  const priceChanges = await prisma.priceChangesGameweek.findMany({});

  const updatedDates = priceChanges.map((dates) => {
    const date = new Date(dates.updatedAt);

    const kickOffDate = date.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "short",
    });
    return {
      playerId: dates.playerElementId,
      name: dates.name,
      cost: dates.cost,
      team: dates.team,
      type: dates.type,
      date: kickOffDate,
    };
  });

  const sortedFixtures = updatedDates?.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date)
  );

  const fixturesByDate = {};

  sortedFixtures?.forEach((fixture) => {
    const date = fixture.date;

    if (!fixturesByDate[date]) {
      fixturesByDate[date] = [];
    }

    fixturesByDate[date]?.push(fixture);
  });

  return fixturesByDate;
}

export default async function PriceChange() {
  const data = await getPriceChanges();

  return (
    <>
      <div className="pricechanges-container">
        <div className="graphic-container">
          <h2 className="transfers-title">Price Changes</h2>
        </div>
        <div className="pricechanges-box">
          {Object.entries(data).map(([date, players]) => (
            <div key={date}>
              <div className="fixture-date-box">
                <span className="fixture-date-inner-box">
                  <h4 style={{ marginBottom: "0" }} className="fixture-date">
                    {date}
                  </h4>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1 }}>
                  <table
                    style={{ width: "100%", marginLeft: 5 }}
                    className="transfers-table-playerchanges"
                  >
                    <thead>
                      <tr>
                        <th className="transfer-header"></th>
                        <th
                          className="transfer-header"
                          style={{ textAlign: "left", paddingTop: "8px" }}
                        >
                          Name
                        </th>
                        <th className="transfer-header"></th>
                        <th
                          className="transfer-header"
                          style={{ textAlign: "left", paddingTop: "8px" }}
                        >
                          Team
                        </th>
                        <th
                          className="transfer-header"
                          style={{ textAlign: "left", paddingTop: "8px" }}
                        >
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {players
                        .filter((player) => player.type === "riser")
                        .map((player, index) => (
                          <tr key={index}>
                            <td
                              style={{ paddingRight: "0px" }}
                              className="arrow-box"
                            >
                              <Image
                                alt="greenarrow up"
                                src={"/images/greenarrowdark.png"}
                                width={16}
                                height={16}
                                className="greenarrowup"
                              ></Image>
                            </td>
                            <td>{player.name}</td>
                            <td></td>
                            <td style={{ textAlign: "left" }}>{player.team}</td>
                            <td style={{ textAlign: "left" }}>{player.cost}</td>
                          </tr>
                        ))}
                      {players.filter((player) => player.type === "riser")
                        .length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            style={{ marginLeft: 10, fontSize: 13 }}
                          >
                            No price rises
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    flex: 1,
                    borderLeft: "1px solid rgba(55, 0, 60, 0.08)",
                    paddingRight: "5px",
                  }}
                >
                  <table
                    style={{ width: "100%", marginLeft: 5 }}
                    className="transfers-table-playerchanges"
                  >
                    <thead>
                      <tr>
                        <th className="transfer-header"></th>
                        <th
                          className="transfer-header"
                          style={{ textAlign: "left", paddingTop: "8px" }}
                        >
                          Name
                        </th>
                        <th className="transfer-header"></th>
                        <th
                          className="transfer-header"
                          style={{ textAlign: "left", paddingTop: "8px" }}
                        >
                          Team
                        </th>
                        <th
                          className="transfer-header"
                          style={{ textAlign: "left", paddingTop: "8px" }}
                        >
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {players
                        .filter((player) => player.type === "faller")
                        .map((player, index) => (
                          <tr key={index}>
                            <td
                              style={{ paddingRight: "0px" }}
                              className="arrow-box"
                            >
                              <Image
                                alt="redarrow down"
                                src={"/images/redarrowdark.png"}
                                width={15}
                                height={15}
                                className="redarrowdown"
                              ></Image>
                            </td>
                            <td>{player.name}</td>
                            <td></td>
                            <td style={{ textAlign: "left" }}>{player.team}</td>
                            <td style={{ textAlign: "left" }}>{player.cost}</td>
                          </tr>
                        ))}
                      {players.filter((player) => player.type === "faller")
                        .length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            style={{ marginLeft: 10, fontSize: 13 }}
                          >
                            No price falls
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
