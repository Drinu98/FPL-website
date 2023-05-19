import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: [
    //   {
    //     emit: 'event',
    //     level: 'query',
    //   },
    //   {
    //     emit: 'stdout',
    //     level: 'error',
    //   },
    //   {
    //     emit: 'stdout',
    //     level: 'info',
    //   },
    //   {
    //     emit: 'stdout',
    //     level: 'warn',
    //   },
    // ],
  })

// prisma.$use(async (params, next) => {
//   const { model, action, args, dataPath, runInTransaction } = params
//   const result = await next(params)
//   console.log('-----------------')
//   console.log(`${model}---${action}`, result)
//   console.log('-----------------')
//   return result
// })
// @ts-ignore
// prisma.$on('query', (e) => {
//   // @ts-ignore
//   console.log('Query: ' + e.query)
//   // @ts-ignore
//   console.log('Params: ' + e.params)
//   // @ts-ignore
//   console.log('Duration: ' + e.duration + 'ms')
// })
if (process.env.NODE_ENV === 'development') global.prisma = prisma

export * from '@prisma/client'
export default prisma
