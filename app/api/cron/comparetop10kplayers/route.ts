import { prisma } from "../../../../services/prisma";

export async function GET(req: Request) {

  if (process.env.STOP_SCRIPT === 'true') {
    console.log('Stopping script as per the condition.');
    process.env.STOP_SCRIPT = 'false'; // Set to false for subsequent runs
    process.exit(0);
  }
  else{
    let validChunkData = [] as any[];
    const top10kplayers = await prisma.top10kPlayers.findMany({});

    const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/",
    {
      next: {
        revalidate: 0,
      },
    });

    const data = await res.json();
    const events = data.events;
    const currentGameweek = events?.find(
      (event: any) => event.is_current === true
    )?.id;

    const playersPerChunk = 100;

    const totalPlayers = top10kplayers.length;
    let currentPage = 0;

    console.log("Starting data processing...");

    while (currentPage < totalPlayers) {
      const startIndex = currentPage;
      const endIndex = Math.min(
        currentPage + playersPerChunk - 1,
        totalPlayers - 1
      );

      console.log(`Processing players ${startIndex} to ${endIndex}...`);

      const chunk = top10kplayers.slice(startIndex, endIndex + 1);

      const promises = chunk.map(async (player) => {
        try {
          const generalResponse = await fetch(
            `https://fantasy.premierleague.com/api/entry/${player.entry}/`,
            {
              next: {
                revalidate: 0,
              },
            });

          const data = await generalResponse.json();

          const currentGameweekScore = data?.summary_event_points;
          const currentGameweekRank = data?.summary_overall_rank;

          console.log(player.entryName, currentGameweekScore);

          return {
            entry: player.entry,
            entryName: player.entryName,
            playerName: player.playerName,
            eventTotal: currentGameweekScore,
            currentRank: currentGameweekRank,
            lastRank: player.currentRank,
          };
        } catch (error) {
          console.error(error);
          return null; // Return null for failed promises
        }
      });

      const chunkData = await Promise.all(promises);
      validChunkData = chunkData.filter((data) => data !== null); // Filter out failed promises

      // console.log(`Processed ${validChunkData.length} players in this chunk`);

      currentPage = endIndex + 1;

      // Add any additional logic if needed, such as sleeping between chunks
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Processing completed");

      console.log("Inserting data into the database...");

      await prisma.top10kPlayersChange.createMany({
        data: validChunkData,
      });

      console.log("Data added to the database");
    }
  }
  
  
}

