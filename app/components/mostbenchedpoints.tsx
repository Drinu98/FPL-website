import Image from "next/image";
import { prisma } from "../../services/prisma";

async function getMostBenchedPoints() {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      {
        next: {
          revalidate: 500,
        },
      }
    );

    const data = await response.json();

    const currentGameweek = data.events?.find(
      (event: any) => event.is_current === true
    )?.id;

    const mostBenched = await prisma.mostBenchedPoints.findMany({});

    mostBenched.sort((a, b) => b.benchedPoints - a.benchedPoints);

    const spliceMostBenched = mostBenched.splice(0, 1);

    return { spliceMostBenched, currentGameweek };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default async function MostBenchedPoints() {
  try {
    const data = await getMostBenchedPoints();

    const twat = data.spliceMostBenched;
    const currentGameweek = data.currentGameweek;

    if (!data) {
      // Display loading message while fetching data
      return (
        <>
          <div className="fixture-container">
            <div className="graphic-container">
              <h2 className="transfers-title">Bench Disaster</h2>
            </div>
            <p className="error-message-twat">
              <Image
                src="/images/errorlogo.png"
                alt="FPL Focal Logo"
                width={50}
                height={50}
                className="error-logo"
              />
              The Game is Updating...
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="fixture-container" style={{backgroundColor:'#67cd98', borderRadius:'8px'}}>
          <div className="graphic-container">
            <h2 className="transfers-title-fewest">Bench Disaster</h2>
          </div>
          <div style={{ marginTop: "30px" }}>
            <div style={{ marginTop: "10px" }}>
              <p
                className="twat-text"
                style={{ textAlign: "center", marginBottom: "0px" }}
              >
                {twat[0]?.playerName}
              </p>
              <p style={{ textAlign: "center", marginBottom: "40px" }}>
                <a
                  target="_blank"
                  href={`https://fantasy.premierleague.com/entry/${twat[0]?.playerEntryId}/event/${currentGameweek}`}
                  className="twat-text-link"
                  rel="noopener noreferrer"
                >
                  {twat[0]?.entryName}
                </a>
              </p>
              <p className="twat-text" style={{ marginBottom: "0px" }}>
                {twat[0].benchedPoints} Points
              </p>
            </div>
          </div>
          <div
            className="twat-box"
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              backgroundColor:'#80d4a8',
              borderBottomRightRadius:'8px',
              borderBottomLeftRadius:'8px',
            }}
          >
            <Image
              alt="expand"
              src={"/images/bench.png"}
              width={230}
              height={80}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <>
        <div className="fixture-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Bench Disaster</h2>
          </div>
          <p className="error-message-twat">
            <Image
              src="/images/errorlogo.png"
              alt="FPL Focal Logo"
              width={50}
              height={50}
              className="error-logo"
            />
            The Game is Updating...
          </p>
        </div>
      </>
    );
  }
}
