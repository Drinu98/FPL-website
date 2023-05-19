import { prisma } from "../../services/prisma";
import DisplayCaptaincy from './DisplayCaptaincy'

async function getCaptaincy() {

  const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', 
    {
        next: {
          revalidate: 300
        },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const currentGameweekData = data?.events;

    const currentGameweek = currentGameweekData.find(gw => gw.is_current === true ); 
    const captains = await prisma.captainPick.findMany({});
    const effectiveOwnership = await prisma.effectiveOwnership.findMany({});

      return {captains, effectiveOwnership, currentGameweek};
    }


export default async function Captaincy(){

  const data = await getCaptaincy();

  const allCaptains = data.captains;
  const allEffectiveOwnership = data.effectiveOwnership;
  const currentGameweek = data.currentGameweek.id;
 
  allCaptains.forEach(captain => {
    captain.chosenAsCaptainPercentage = captain.chosenAsCaptainPercentage.toFixed(2);
  });

  allEffectiveOwnership.forEach(captain => {
    captain.chosenEffectiveOwnershipPercentage = captain.chosenEffectiveOwnershipPercentage.toFixed(2);
  });

  const dataSortedByChosenAsCaptainPercentage = [...allCaptains].sort((a, b) => b.chosenAsCaptainPercentage - a.chosenAsCaptainPercentage);
  const dataSortedByChosenEffectiveOwnershipPercentage = [...allEffectiveOwnership].sort((a, b) => b.chosenEffectiveOwnershipPercentage - a.chosenEffectiveOwnershipPercentage);

  const captaincy = dataSortedByChosenAsCaptainPercentage?.slice(0, 7);
  const effectiveOwnership = dataSortedByChosenEffectiveOwnershipPercentage?.slice(0, 7);

  return (
        <DisplayCaptaincy captaincy={captaincy} eo={effectiveOwnership} gameweek={currentGameweek}/>
  );
}