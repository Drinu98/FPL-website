import { prisma } from "../../../../services/prisma";

const exclude = <O extends Record<string, any>, Key extends keyof O>(
  obj: O & {
    [key: string]: any;
  },
  keys: Key[]
): Omit<O, Key> => {
  let newObj = {} as O & {
    [key: string]: any;
  };
  for (let key in obj) {
    if ((keys as string[]).includes(key)) {
      continue;
    }
    newObj[key as keyof typeof newObj] = obj[key];
  }

  return newObj;
};

export async function POST(request: Request, response: Response){
  console.log("Sum count started");
  const picks = await prisma.playerPicks.findMany({});
  const pickByTypeWithSum = picks.reduce(
    (acc, pick) => {
      const type = pick.type as keyof typeof acc;
      if (!acc[type][pick.playerElementId]) {
        acc[type][pick.playerElementId] = exclude(pick, ["type"]);
      } else {
        acc[type][pick.playerElementId].count += pick.count;
      }
      return acc;
    },
    {
      captaincy: {} as Record<string, any>,
      effectiveOwnership: {} as Record<string, any>,
    }
  );

  //   console.log(pickByTypeWithSum);
  const allCaptains = Object.values(pickByTypeWithSum.captaincy);
  const allPlayers = Object.values(pickByTypeWithSum.effectiveOwnership);
  const totalCaptains = allCaptains.reduce(
    (total, player) => total + player.count,
    0
  );
  const allCaptainsWithPercentage = allCaptains.map((player) => {
    const percentage = (player.count / totalCaptains) * 100;
    player.chosenAsCaptainPercentage = percentage;
    return player;
  });

  const allCaptainsWithPercentageById = allCaptainsWithPercentage.reduce((acc, captain) => {
    acc[captain.playerElementId] = captain
    return acc
  }, {} as Record<string, typeof allCaptainsWithPercentage[number]>)


  const allPlayersWithEoPercentage = allPlayers.map(player => {
    const isPlayerCaptain = allCaptainsWithPercentageById[player.playerElementId]

    if (!isPlayerCaptain) {
        return {
            ...player,
            chosenEffectiveOwnershipPercentage: ((player.count + 0) / 10000) * 100
        }
    }
    const captaincyCount = isPlayerCaptain.count ?? 0;
    const combinedCount = ((player.count + captaincyCount) / 10000) * 100;
    return {
        ...player,
        chosenEffectiveOwnershipPercentage: combinedCount
    }
  })
  await prisma.$transaction(async ($tx) => {
    await Promise.all([
      $tx.captainPick.deleteMany(),
      $tx.effectiveOwnership.deleteMany(),
    ]);
    await Promise.all([
      $tx.captainPick.createMany({
        data: allCaptainsWithPercentage,
      }),
      $tx.effectiveOwnership.createMany({
        data: allPlayersWithEoPercentage,
      }),
    ]);
  });

  await prisma.playerPicks.deleteMany();
  console.log("Sum count Done");
  return new Response(
    JSON.stringify({
      //   pickByTypeWithSum,
      //   picks,
      message: "ok",
    })
  );
};
