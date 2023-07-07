import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client"
interface NextRoutingRequest extends NextRequest {
    query: {
        lng1: number,
        lat1: number,
        lng2: number,
        lat2: number
    }
}

export default async function handler(req : NextRoutingRequest, res : any) {
    const { lng1, lat1, lng2, lat2 } = req.query
    const startGeom = `POINT (${lat1} ${lng1})`
    const endGeom = `POINT (${lat2} ${lng2})`
    const client = new PrismaClient({log: ['query', 'info', 'warn', 'error']})
    await client.$connect()
    
    let routes : any[] = await client.$queryRawUnsafe(`
        -- find the nearest vertex to the start longitude/latitude
        WITH start AS (
        SELECT topo.source --could also be topo.target
        FROM lisbon_2po_4pgr as topo
        ORDER BY topo.geom_way <-> ST_SetSRID(
            ST_GeomFromText('${startGeom}'),
        4326)
        LIMIT 1
        ),
        -- find the nearest vertex to the destination longitude/latitude
        destination AS (
        SELECT topo.target --could also be topo.target
        FROM lisbon_2po_4pgr as topo
        ORDER BY topo.geom_way <-> ST_SetSRID(
            ST_GeomFromText('${endGeom}'),
        4326)
        LIMIT 1
        )
        -- use Dijsktra and join with the geometries
        SELECT edge, St_AsGeoJson(geom_way)
        FROM pgr_dijkstra('
            SELECT id,
                source,
                target,
                cost
                FROM lisbon_2po_4pgr',
            array(SELECT * FROM start),
		    array(SELECT * FROM destination),
            directed := true) as di
        JOIN lisbon_2po_4pgr as topo
        ON di.edge = topo.id
        ;
    `)
    routes = routes.map(r => JSON.parse(r.st_asgeojson).coordinates)

    res.json(routes)
}