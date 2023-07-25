const { PrismaClient } = require('@prisma/client');
const { parentPort } = require('worker_threads');
const prisma = new PrismaClient()
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