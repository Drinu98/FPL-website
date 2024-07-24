// import { NextResponse } from 'next/server';
// import url from 'url'

// /**
//  * Logging
//  * Error handling - what if for some reason all APIs fail? Schedule retry
//  * What if the summation transaction fails? Schedule retry
//  */

//   const getQueryParam = <T>(param: string | string[], defaultValue: T) => {
//     if (Array.isArray(param)) {
//       return param?.[0] || defaultValue
//     }
//     return param || defaultValue
//   }

// export async function GET(req: Request) {
//   if (process.env.STOP_SCRIPT === 'true') {
//     console.log('Stopping script as per the condition.');
//     process.env.STOP_SCRIPT = 'false'; // Set to false for subsequent runs
//     process.exit(0);
//   }else{
//     let executionCount = 0
//   let page = 1;
//   const BASE_URL = `${process.env.VERCEL_URL?.startsWith('localhost') ? 'http' : 'https'}://${process.env.VERCEL_URL}`
//   console.log('BASE URL', BASE_URL)
//   try {
    
//     // const res = await req.json();
//     // console.log('res', res)
//     // if (res) {
//     //   executionCount = res.executionCount || 0
//     //   page = res.page || 1
//     // }
//     const { query } = url.parse(req.url, true);
//     if (query && query.page && query.executionCount) {
//       executionCount = parseInt(getQueryParam(query.executionCount, '0'))
//       page =  parseInt(getQueryParam(query.page, '1'))
//     }
//   } catch (error) {
//     // console.error(error)
//   }
//   console.log("INIT", {
//     executionCount,
//     page,
//     // body: req.body,
//     // query: req.query,
//   });
//   // await sleep();
//   if (executionCount > 50) {
//     console.log("execution count exceeded", executionCount);
//     return;
//   }

//   const generalResponse = await fetch(
//     "https://fantasy.premierleague.com/api/bootstrap-static/",
//     {
//       next: {
//         revalidate: 0,
//       },
//     }
//   );

//   const data = await generalResponse.json();

//   const events = data?.events;
//   const playerList = data?.elements;

//   const currentGameweekData = events?.find(
//     (event: any) => event?.is_current === true
//   );

//   const currentGameweek = currentGameweekData?.id;
//   const leagueId = 314; // Change league ID to your league ID
//   // const maxRank = 10000; // Change max number of players to retrieve
//   const maxRank = 10; // Change max number of players to retrieve
//   let totalPages = 202; // Change to the total number of pages to fetch
//   // let totalPages = 1; // Change to the total number of pages to fetch
//   // const pagesPerCron = Math.ceil(totalPages / 4);
//   const pagesPerCron = 2;
//   // const pagesPerCron = 1
//   // console.log("--------");
//   // console.log("pages per cron", pagesPerCron);
//   // console.log("--------");
//   const pagesPerFunction = 2;
//   const promises = [] as Array<Promise<any>>;
//   let pagesProcessed = 0;

//   while (page <= totalPages && pagesProcessed < pagesPerCron) {
//     let startPage = page;
//     let endPage = startPage + pagesPerFunction - 1;
//     if (endPage > totalPages) {
//       endPage = totalPages;
//       if (startPage > totalPages) {
//         startPage = totalPages;
//       }
//     }

//     promises.push(
//       fetch(`${BASE_URL}/api/mostbenchedpoints/process-data`, {
//         method: 'POST',
//         body: JSON.stringify({
//           startPage,
//           endPage,
//           leagueId,
//           currentGameweek,
//         })
//       })
//     );

//     // console.log({
//     //   startPage,
//     //   endPage,
//     // });
//     page = endPage + 1;
//     pagesProcessed+= (endPage - startPage)

//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }

//   const result = await Promise.allSettled(promises);
//   // await sleep();
//   if (page < totalPages) {
//     console.log(
//       `Calling another cron api function. Processed ${page} of ${totalPages}. Execution count: ${executionCount}`
//     );

//     fetch(`${BASE_URL}/api/mostbenchedpoints?page=${page}&executionCount=${executionCount}`, {
//       method: 'GET',
    
//       // body: JSON.stringify({
//       //   executionCount: executionCount + 1,
//       //   page,
//       // }),
//     });

//     return new NextResponse(
//       JSON.stringify({
//         inProgress: true,
//       })
//     );
//   }
// //   fetch(`${BASE_URL}/api/captain/sum-counts`, {
// //     method: 'POST'
// //   })
//   console.log("Done", {
//     page,
//     result
//   });
//   return new NextResponse(JSON.stringify({ page, result }));
//   }
  
// }

import { NextResponse } from 'next/server';
import url from 'url'

export async function GET(req: Request) {
  const getQueryParam = <T>(param: string | string[], defaultValue: T) => {
    if (Array.isArray(param)) {
      return param?.[0] || defaultValue
    }
    return param || defaultValue
  }

  let executionCount = 0
  let page = 1;
  const BASE_URL = `${process.env.VERCEL_URL?.startsWith('localhost') ? 'http' : 'https'}://${process.env.VERCEL_URL}`
  console.log('BASE URL', BASE_URL)

  try {
    const { query } = url.parse(req.url, true);
    if (query && query.page && query.executionCount) {
      executionCount = parseInt(getQueryParam(query.executionCount, '0'))
      page = parseInt(getQueryParam(query.page, '1'))
    }
  } catch (error) {
    console.error(error)
  }

  console.log("INIT", { executionCount, page });

  if (executionCount > 50) {
    console.log("execution count exceeded", executionCount);
    return new NextResponse(JSON.stringify({ message: "Execution count limit reached" }));
  }

  const generalResponse = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    { next: { revalidate: 0 } }
  );

  const data = await generalResponse.json();

  const events = data?.events;
  const currentGameweekData = events?.find((event: any) => event?.is_current === true);
  const currentGameweek = currentGameweekData?.id;

  const leagueId = 314;
  const maxRank = 10;
  let totalPages = 202;
  const pagesPerCron = 10; // Increased from 2
  const pagesPerFunction = 5; // Increased from 2

  const promises = [];
  let pagesProcessed = 0;

  while (page <= totalPages && pagesProcessed < pagesPerCron) {
    for (let i = 0; i < Math.min(pagesPerCron, totalPages - page + 1); i++) {
      let startPage = page + i * pagesPerFunction;
      let endPage = Math.min(startPage + pagesPerFunction - 1, totalPages);

      promises.push(
        fetch(`${BASE_URL}/api/mostbenchedpoints/process-data`, {
          method: 'POST',
          body: JSON.stringify({
            startPage,
            endPage,
            leagueId,
            currentGameweek,
          })
        })
      );

      pagesProcessed += (endPage - startPage + 1);
    }

    page += pagesProcessed;
  }

  const results = await Promise.allSettled(promises);

  if (page <= totalPages) {
    console.log(
      `Calling another cron api function. Processed ${page - 1} of ${totalPages}. Execution count: ${executionCount}`
    );

    fetch(`${BASE_URL}/api/mostbenchedpoints?page=${page}&executionCount=${executionCount + 1}`, {
      method: 'GET',
    });

    return new NextResponse(JSON.stringify({ inProgress: true }));
  }

  console.log("Done", { page, results });
  return new NextResponse(JSON.stringify({ page, results }));
}