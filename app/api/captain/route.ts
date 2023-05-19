import { NextApiRequest, NextApiResponse } from "next";

/**
 * Logging
 * Error handling - what if for some reason all APIs fail? Schedule retry
 * What if the summation transaction fails? Schedule retry
 */

const sleep = async () =>
  new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

async function handler(req: Request, res: Response) {
  let executionCount = 0
  let page = 1;
  
  try {
    const res = await req.json();
    console.log('res', res)
    if (res) {
      executionCount = res.executionCount || 0
      page = res.page || 1
    }
  } catch (error) {
    // console.error(error)
  }
  console.log("INIT", {
    executionCount,
    page,
    // body: req.body,
    // query: req.query,
  });
  // await sleep();
  if (executionCount > 50) {
    console.log("execution count exceeded", executionCount);
    return;
  }
  const generalResponse = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    {
      next: {
        revalidate: 300,
      },
    }
  );

  const data = await generalResponse.json();

  const events = data?.events;
  const playerList = data?.elements;

  const currentGameweekData = events?.find(
    (event: any) => event?.is_current === true
  );
  const currentGameweek = currentGameweekData?.id;
  const leagueId = 314; // Change league ID to your league ID
  // const maxRank = 10000; // Change max number of players to retrieve
  const maxRank = 10; // Change max number of players to retrieve
  let totalPages = 202; // Change to the total number of pages to fetch
  // let totalPages = 1; // Change to the total number of pages to fetch
  // const pagesPerCron = Math.ceil(totalPages / 4);
  const pagesPerCron = 5;
  // const pagesPerCron = 1
  // console.log("--------");
  // console.log("pages per cron", pagesPerCron);
  // console.log("--------");
  const pagesPerFunction = 5;
  const promises = [] as Array<Promise<any>>;
  let pagesProcessed = 0;

  while (page <= totalPages && pagesProcessed < pagesPerCron) {
    let startPage = page;
    let endPage = startPage + pagesPerFunction - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      if (startPage > totalPages) {
        startPage = totalPages;
      }
    }

    promises.push(
      fetch('/api/captain/process-data', {
        method: 'POST',
        body: JSON.stringify({
          startPage,
          endPage,
          leagueId,
          currentGameweek,
          playerList
        })
      })
    );

    // console.log({
    //   startPage,
    //   endPage,
    // });
    page = endPage + 1;
    pagesProcessed+= (endPage - startPage)
  }

  const result = await Promise.allSettled(promises);
  // await sleep();
  if (page < totalPages) {
    console.log(
      `Calling another cron api function. Processed ${page} of ${totalPages}. Execution count: ${executionCount}`
    );
    fetch(`/api/captain?page=${page}&executionCount=${executionCount}`, {
      method: "POST",
    
      body: JSON.stringify({
        executionCount: executionCount + 1,
        page,
      }),
    });

    return new Response(
      JSON.stringify({
        inProgress: true,
      })
    );
  }
  fetch(`/api/captain/sum-counts`, {
    method: 'POST'
  })
  console.log("Done", {
    page,
    // result
  });
  return new Response(JSON.stringify({ page, result }));
}

export const POST = handler;
