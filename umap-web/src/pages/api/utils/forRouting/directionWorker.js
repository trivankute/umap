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

async function forDirectionWorker(routes, route, index, totalLength) {
    totalLength += route.km 
    if (index === 0) {
        return {
            ...route, direction: 'start'
        }
    }
    else {
        let degrees = await prisma.$queryRawUnsafe(`
            SELECT degrees(ST_Azimuth( st_startpoint($1), st_centroid($1) )) AS degA_B,
            degrees(ST_Azimuth( st_startpoint($2), st_centroid($2) )) AS degB_A`,
            route.geom_way, routes[index - 1].geom_way)
        await prisma.$disconnect()
        let direction = ''
        // count degress between 2 routes
        let deg = degrees[0].dega_b - degrees[0].degb_a
        // console.log(route.id, deg)
        let isLeftSide = false // if the previous route is on the left side of the current route
        if (deg <= 180 && deg >= 0)
            isLeftSide = true
        else if (deg > 180) {
            deg = 360 - deg
            isLeftSide = false
        }
        else if (deg >= -180) {
            deg = 0 - deg
            isLeftSide = false
        }
        else if (deg >= -360) {
            deg = 360 + deg
            isLeftSide = true
        }
        if (isLeftSide) {
            if (deg <= 30)
                direction = 'straight'
            else if (deg <= 135)
                direction = 'right'
            else
                direction = 'u turn right'
        }
        else {
            if (deg <= 30)
                direction = 'straight'
            else if (deg <= 135)
                direction = 'left'
            else
                direction = 'u turn left'
        }
        return {
            ...route, direction
        }
    }
}

parentPort.on('message', async (data) => {
    const { routes, route, index, totalLength } = data
    const result = await forDirectionWorker(routes, route, index, totalLength)
    parentPort.postMessage(result)
})