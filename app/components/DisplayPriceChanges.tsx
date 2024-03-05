"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

type Fixture = {
  name: string;
  team: string;
  cost: number;
};

type DisplayFixturesProps = {
  risers: Array<Fixture>;
  fallers: Array<Fixture>;
};

const DisplayPriceChanges = (props: DisplayFixturesProps) => {
  const { risers, fallers } = props;

  const router = usePathname();

  return (
    <>
      <div className="pricechanges-container">
        <div className="graphic-container">
          <h2 className="transfers-title">Price Changes</h2>
          {router === "/" && (
            <a href="/pricechanges" className="expand-image-captaincy">
              <Image
                alt="expand"
                src={"/images/expand.png"}
                width={20}
                height={20}
                className="expand-image"
              />
            </a>
          )}
        </div>
        <div style={{ overflow: "auto", height: "100%" }}>
          <div
            style={{ display: "flex", marginTop: 5 }}
            className="pricechanges-box"
          >
            <div style={{ flex: 1 }}>
              <table
                style={{ width: "100%", marginLeft: 5 }}
                className="transfers-table-playerchanges"
              >
                <thead>
                  <tr>
                    <th className="transfer-header"></th>
                    <th className="transfer-header">Name</th>
                    <th className="transfer-header"></th>
                    <th
                      className="transfer-header"
                      style={{ textAlign: "left" }}
                    >
                      Team
                    </th>
                    <th
                      className="transfer-header"
                      style={{ textAlign: "left" }}
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {risers.length > 0 ? (
                    risers.map((player, index) => (
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
                    ))
                  ) : (
                    <tr>
                      <td style={{ marginLeft: 10, fontSize: 13 }}>
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
                paddingRight: 5,
              }}
            >
              <table
                style={{ width: "100%" }}
                className="transfers-table-playerchanges"
              >
                <thead>
                  <tr>
                    <th className="transfer-header"></th>
                    <th className="transfer-header">Name</th>
                    <th className="transfer-header"></th>
                    <th
                      className="transfer-header"
                      style={{ textAlign: "left" }}
                    >
                      Team
                    </th>
                    <th
                      className="transfer-header"
                      style={{ textAlign: "left" }}
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fallers.length > 0 ? (
                    fallers.map((player, index) => (
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
                    ))
                  ) : (
                    <tr>
                      <td style={{ marginLeft: 10, fontSize: 13 }}>
                        No price falls
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ marginTop: 7 }}>
            <p className="courtesy-text">
              For Price Changes History go{" "}
              <a
                target="_blank"
                href={"/pricechanges"}
                className="courtesy-link"
                rel="noopener noreferrer"
              >
                here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayPriceChanges;
