import Image from "next/image";
import { prisma } from "../../services/prisma";

async function getSetAndForget() {
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

    const top10kplayers = await prisma.topSetAndForget.findMany({});

    top10kplayers.sort((a, b) => a.transfers - b.transfers);

    const spliceSetAndForget = top10kplayers.splice(0, 1);

    return { spliceSetAndForget, currentGameweek };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default async function SetAndForget() {
  try {
    const data = await getSetAndForget();

    const twat = data.spliceSetAndForget;
    const currentGameweek = data.currentGameweek;

    if (!data) {
      // Display loading message while fetching data
      return (
        <>
          <div className="fixture-container">
            <div className="graphic-container">
              <h2 className="transfers-title">Disaster of the Week</h2>
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
        <div className="fixture-container">
          <div className="graphic-container">
            <h2 className="transfers-title">Set & Forget</h2>
          </div>
          <div style={{marginTop:'auto', marginBottom:'auto'}}>
            <div style={{marginTop:'10px'}}>
              <p className="twat-text" style={{ textAlign: "center", marginBottom:'0px' }}>
                {twat[0]?.playerName}
              </p>
              <p style={{ textAlign: "center" }}>
                <a
                  target="_blank"
                  href={`https://fantasy.premierleague.com/entry/${twat[0]?.playerEntryId}/event/${currentGameweek}`}
                  className="twat-text-link"
                  rel="noopener noreferrer"
                >
                  {twat[0]?.entryName}
                </a>
              </p>
            </div>
            <div className="twat-box">
              <p className="twat-text" style={{marginBottom:'3px'}}>Points: {twat[0]?.eventTotal}</p>
              <p className="twat-text" style={{marginBottom:'3px'}}>
                Rank: {twat[0]?.currentRank.toLocaleString()}
              </p>
              <p className="twat-text">
                Transfers: {twat[0].transfers} 
              </p>
            </div>
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
            <h2 className="transfers-title">Disaster of the Week</h2>
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
