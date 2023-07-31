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

async function forJsonConvert(route) {
    if (Array.isArray(route)) {
        let geojsonText = await prisma.$queryRawUnsafe(`
        select ST_MakeLine($1)::text as geojson`, route.map((r) => r.geom_way))
        await prisma.$disconnect()
        let geojson = await prisma.$queryRawUnsafe(`
        select ST_AsGeoJSON($1) as geojson`, geojsonText[0].geojson)
        await prisma.$disconnect()
        let newLength = await route.reduce((acc, cur) => acc + cur.km, 0)

        return {
            osm_name: route[0].osm_name,
            km: newLength,
            direction: route[0].direction,
            coors: JSON.parse(geojson[0].geojson).coordinates,
            geom_way: geojsonText[0].geojson
        }
    }
    else {
        let geojson = await prisma.$queryRawUnsafe(`
        select ST_AsGeoJSON($1) as geojson`, route.geom_way)
        await prisma.$disconnect()
        return {
            osm_name: route.osm_name,
            km: route.km,
            direction: route.direction,
            coors: JSON.parse(geojson[0].geojson).coordinates,
            geom_way: route.geom_way
        }
    }
}

parentPort.on('message', async (data) => {
    const { route } = data
    const result = await forJsonConvert(route)
    parentPort.postMessage(result)
})