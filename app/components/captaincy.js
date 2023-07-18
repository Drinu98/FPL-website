import { prisma } from "../../services/prisma";
import DisplayCaptaincy from './DisplayCaptaincy';
import Image from 'next/image'

async function getCaptaincy() {
  try {
    const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      next: {
        revalidate: 300
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    const currentGameweekData = data?.events;
    const currentGameweek = currentGameweekData.find(gw => gw.is_current === true) ?? 'Error: ID is undefined.';
    const captains = await prisma.captainPick.findMany({});
    const effectiveOwnership = await prisma.effectiveOwnership.findMany({});

    return { captains, effectiveOwnership, currentGameweek };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch captaincy data');
  }
}

export default async function Captaincy() {
  try {
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
      <DisplayCaptaincy captaincy={captaincy} eo={effectiveOwnership} gameweek={currentGameweek} />
    );
  } catch (error) {
    console.error(error);
    return <>
      <div className='captaincy-container'>
        <div className='graphic-container'>
            <h2 className='transfers-title'>Top 10K</h2>
        </div>
        <p className='error-message'>
          <Image src="/images/errorlogo.png"
                  alt="FPL Focal Logo"
                  width={50}
                  height={50}
                  className='error-logo'>
          </Image>The Game is Updating...</p>
      </div>    
      </>
  }
}
