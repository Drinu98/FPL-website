import { prisma } from "../../../../services/prisma";

export async function GET(req: Request) {
    try {
        let remainingPlayers = true;
        let offset = 0;
        const batchSize = 1000;
    
        while (remainingPlayers) {
          // Fetch 1000 players from the database
          const playersToDelete = await prisma.top10kPlayersChange.findMany({
            take: batchSize,
          });
          console.log(`Total players fetched: ${playersToDelete.length}.`);
          // If there are players to delete, delete them
          if (playersToDelete.length > 0) {
            await prisma.top10kPlayersChange.deleteMany({

              where: {
                entry: { in: playersToDelete.map((player) => player.entry) },
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
      } catch (error) {
        console.error('Error deleting players:', error);
      }
}
