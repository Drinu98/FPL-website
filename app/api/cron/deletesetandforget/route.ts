import { prisma } from "../../../../services/prisma";

export async function GET(req: Request) {
    try {
      if (process.env.STOP_SCRIPT === 'true') {
        console.log('Stopping script as per the condition.');
        process.env.STOP_SCRIPT = 'false'; // Set to false for subsequent runs
        process.exit(0);
      }else{
        let remainingPlayers = true;
        let offset = 0;
        const batchSize = 1000;
    
        while (remainingPlayers) {
          // Fetch 1000 players from the database
          const playersToDelete = await prisma.topSetAndForget.findMany({
            take: batchSize,
          });
          console.log(`Total players fetched: ${playersToDelete.length}.`);
          // If there are players to delete, delete them
          if (playersToDelete.length > 0) {
            await prisma.topSetAndForget.deleteMany({

              where: {
                playerEntryId: { in: playersToDelete.map((player) => player.playerEntryId) },
              },
            });
    
            console.log(`Deleted ${playersToDelete.length} players. Total deleted: ${offset + playersToDelete.length}`);
    
            // Update the offset for the next batch
            offset += playersToDelete.length;

            await new Promise((resolve) => setTimeout(resolve, 2000));

          } else {
            // If no players left, exit the loop
            remainingPlayers = false;
          }
        }
    
        console.log('All players deleted.');
      } 
      } catch (error) {
        console.error('Error deleting players:', error);
      }
}
