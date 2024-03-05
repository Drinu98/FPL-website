import { prisma } from "../../services/prisma";
import DisplayPriceChanges from "./DisplayPriceChanges";

async function getPriceChanges() {
  const risers = await prisma.priceChangesIncrease.findMany({});
  const fallers = await prisma.priceChangesDecrease.findMany({});

  return { risers, fallers };
}

export default async function PriceChanges() {
  const data = await getPriceChanges();

  const risers = data.risers;
  const fallers = data.fallers;

  return <DisplayPriceChanges risers={risers} fallers={fallers} />;
}
