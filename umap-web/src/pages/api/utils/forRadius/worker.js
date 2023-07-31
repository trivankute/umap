const { PrismaClient } = require('@prisma/client');
const { parentPort } = require('worker_threads');
let prisma;

if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient();
    } else {
        // @ts-ignore
        if (!global.prisma) {
        // @ts-ignore
            global.prisma = new PrismaClient();
        }

        // @ts-ignore
        prisma = global.prisma;
    }
}
const nearestAddress = require('../nearestAddressFromCoor.js')

async function forRadiusWorker( lng, lat) {
    let result = await nearestAddress( prisma, lng, lat)
    return result
}

parentPort.on('message', async (data) => {
    const { lng, lat } = data
    const result = await forRadiusWorker(lng, lat)
    parentPort.postMessage(result)
})