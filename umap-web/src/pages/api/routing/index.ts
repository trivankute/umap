import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import forDirection from "../utils/forRouting/forDirection";
import forJsonConvert from "../utils/forRouting/forJsonConvert";

interface NextRoutingRequest extends NextRequest {
    query: {
        lng1: number,
        lat1: number,
        lng2: number,
        lat2: number,
        mode: "car" | "foot"
    }
}

export default async function handler(req: NextRoutingRequest, res: any) {
    res.on('close', () => {
        prisma.$disconnect()
        return res.end()
    })
    const { lng1, lat1, lng2, lat2, mode } = req.query
    // check validation
    if (!lng1 || !lat1 || !lng2 || !lat2 || !mode) {
        res.status(400).json({ message: 'You must provide all lng1, lat1, lng2, lat2, mode' })
        return
    }
    let databaseName = mode === 'car' ? 'lisbon_2po_4pgr' : 'forFoot_2po_4pgr'
    let totalLength = 0
    let startPoint = await prisma.$queryRawUnsafe(`
    with 
    startPoint as
    (select ST_SetSRID(
    ST_GeomFromText('POINT (${lng1} ${lat1})'),
    4326) as geometry)
        select geometry::text from startPoint
    `)
    await prisma.$disconnect()
    if (res.closed)
        return

    let endPoint = await prisma.$queryRawUnsafe(`
    with 
    endPoint as
    (select ST_SetSRID(
    ST_GeomFromText('POINT (${lng2} ${lat2})'),
    4326) as geometry)
        select geometry::text from endPoint
    `)
    await prisma.$disconnect()
    if (res.closed)
        return

    let nearStartPoint = await prisma.$queryRawUnsafe(`
    with 
    nearStartPoint as (select st_closestPoint(st_transform(planet_osm_line.way,4326), $1) as start_geometry from planet_osm_line
    where boundary isnull and name notnull
    order by st_closestPoint(st_transform(planet_osm_line.way,4326), $1) <-> $1
    limit 1)
    select start_geometry::text from nearStartPoint
    `, startPoint[0].geometry)
    await prisma.$disconnect()
    if (res.closed)
        return

    let nearEndPoint = await prisma.$queryRawUnsafe(`
    with
    nearEndPoint as (select st_closestPoint(st_transform(planet_osm_line.way,4326), $1) as end_geometry from planet_osm_line
    where boundary isnull and name notnull
    order by st_closestPoint(st_transform(planet_osm_line.way,4326), $1) <-> $1
    limit 1)
    select end_geometry::text from nearEndPoint
    `, endPoint[0].geometry)
    await prisma.$disconnect()
    if (res.closed)
        return

    let routes = await prisma.$queryRawUnsafe(`
    with
    -- find he nearest vertex to the start longitude/latitude
    start AS (
    SELECT topo.source --could also be topo.target
    FROM ${databaseName} as topo
    ORDER BY topo.geom_way <-> $1
    LIMIT 1
    ),
    -- find the nearest vertex to the destination longitude/latitude
    destination AS (
    SELECT topo.source --could also be topo.target
    FROM ${databaseName} as topo
    ORDER BY topo.geom_way <-> $2
    LIMIT 1
    ),
    -- use Dijsktra and join with the geometries
    dijkstra AS (
        SELECT * FROM pgr_dijkstra('
        SELECT id,
            source,
            target,
            cost
            FROM ${databaseName}',
        array(SELECT * FROM start),
        array(SELECT * FROM destination),
        directed := $3)
    ),
    directedTable as (SELECT *,
        case 
            when di.node = topo.source then topo.geom_way
            else st_reverse(topo.geom_way)
        end as route_geom
    FROM dijkstra as di
    JOIN ${databaseName} as topo
    ON di.edge = topo.id)
    select osm_name, km, route_geom::text as geom_way, directedTable.source::text as routeSource, directedTable.target::text as routeTarget,
    start.source as startSource
    from directedTable, start
    `, nearStartPoint[0].start_geometry, nearEndPoint[0].end_geometry, mode === 'car' ? true : false)
    await prisma.$disconnect()
    if (res.closed)
        return

    // line from start point to near start point
    let lineFromStartPoint = await prisma.$queryRawUnsafe(`
    select st_makeline($1, $2)::text as geometry
    `, startPoint[0].geometry, nearStartPoint[0].start_geometry)
    await prisma.$disconnect()
    if (res.closed)
        return

    // line from end point to near end point
    let lineFromEndPoint = await prisma.$queryRawUnsafe(`
    select st_makeline($1, $2)::text as geometry
    `, nearEndPoint[0].end_geometry, endPoint[0].geometry)
    await prisma.$disconnect()
    if (res.closed)
        return

    let closestPointFromStartToRoute = await prisma.$queryRawUnsafe(
        `select st_closestPoint($1, $2)::text as geometry`
        , routes[0].geom_way, startPoint[0].geometry)
    await prisma.$disconnect()
    if (res.closed)
        return

    let startPointOfRouteFirst = await prisma.$queryRawUnsafe(`
        select st_startpoint($1)::text as geometry
    `, routes[0].geom_way)
    await prisma.$disconnect()
    if (res.closed)
        return

    let closestPointFromEndToRoute = await prisma.$queryRawUnsafe(`
        select st_closestPoint($1, $2)::text as geometry`,
        routes[routes.length - 1].geom_way, endPoint[0].geometry)
    await prisma.$disconnect()
    if (res.closed)
        return

    let endPointOfRouteLast = await prisma.$queryRawUnsafe(`
        select st_endpoint($1)::text as geometry
    `, routes[routes.length - 1].geom_way)
    await prisma.$disconnect()
    if (res.closed)
        return

    if (closestPointFromStartToRoute[0].geometry === startPointOfRouteFirst[0].geometry) {
        // prepare to unshift the routes[0]
        let lineConnectAtStart = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), st_startpoint($2))::text as geometry
        `, lineFromStartPoint[0].geometry, routes[0].geom_way)
        await prisma.$disconnect()
        if (res.closed)
            return

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtStart[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // unshift the routes[0] for lineConnectAtStart
        routes.unshift({
            osm_name: 'start',
            km: length[0].length / 1000,
            geom_way: lineConnectAtStart[0].geometry
        })
        // add line from near start point to start point
        routes.unshift({
            osm_name: 'start',
            km: 0,
            geom_way: lineFromStartPoint[0].geometry
        })
    }
    else {
        // prepare to replace the routes[0]
        let lineConnectAtStart = await prisma.$queryRawUnsafe(`
        select st_makeline($1, st_endpoint($2))::text as geometry
        `, closestPointFromStartToRoute[0].geometry, routes[0].geom_way)
        await prisma.$disconnect()
        if (res.closed)
            return

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtStart[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // replace the routes[0]
        routes[0] = {
            osm_name: 'near_start',
            km: length[0].length / 1000,
            geom_way: lineConnectAtStart[0].geometry
        }

        // make line between start point and closestPointFromStartToRoute
        let lineFromStartPointToClosestPoint = await prisma.$queryRawUnsafe(`
        select st_makeline($1, $2)::text as geometry
        `, startPoint[0].geometry, closestPointFromStartToRoute[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // add line from near start point to closestPointFromStartToRoute
        routes.unshift({
            osm_name: 'start',
            km: 0,
            geom_way: lineFromStartPointToClosestPoint[0].geometry
        })
    }


    if (closestPointFromEndToRoute[0].geometry === endPointOfRouteLast[0].geometry) {
        // prepare to push the routes[routes.length - 1]
        let lineConnectAtEnd = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), st_startpoint($2))::text as geometry
        `, routes[routes.length - 1].geom_way, lineFromEndPoint[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtEnd[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // push the routes[routes.length - 1] for lineConnectAtEnd
        routes.push({
            osm_name: 'near_end',
            km: length[0].length / 1000,
            geom_way: lineConnectAtEnd[0].geometry
        })

        // add line from end point to near end point
        routes.push({
            osm_name: 'end',
            km: 0,
            geom_way: lineFromEndPoint[0].geometry
        })
    }
    else {
        // prepare to replace the routes[routes.length - 1]
        let lineConnectAtEnd = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), $2)::text as geometry
        `, routes[routes.length - 2].geom_way, closestPointFromEndToRoute[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtEnd[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // replace the routes[routes.length - 1]
        routes[routes.length - 1] = {
            osm_name: 'near_end',
            km: length[0].length / 1000,
            geom_way: lineConnectAtEnd[0].geometry
        }

        // make line between end point and closestPointFromEndToRoute
        let lineFromEndPointToClosestPoint = await prisma.$queryRawUnsafe(`
        select st_makeline($1, $2)::text as geometry
        `, closestPointFromEndToRoute[0].geometry, endPoint[0].geometry)
        await prisma.$disconnect()
        if (res.closed)
            return

        // add line from closestPointFromEndToRoute to end point
        routes.push({
            osm_name: 'end',
            km: 0,
            geom_way: lineFromEndPointToClosestPoint[0].geometry
        })
    }

    // add directions to the routes
    routes = await forDirection(routes, totalLength)
    if (res.closed)
        return

    // connect those consecutive whose direction is straight and have same name
    let newRoutes: any = []
    let temp: any = []
    routes.forEach((route: any, index: number) => {
        if (route.direction === 'straight') {
            if (temp.length === 0) {
                temp.push(route)
            }
            else {
                if (temp[temp.length - 1].osm_name === route.osm_name) {
                    temp.push(route)
                }
                else {
                    newRoutes.push(temp)
                    temp = []
                    temp.push(route)
                }
            }
        }
        else {
            if (temp.length > 0) {
                newRoutes.push(temp)
                temp = []
            }
            newRoutes.push(route)
        }
    })

    // loop over newRoutes to convert geom_way to json
    newRoutes = await forJsonConvert(newRoutes)
    if (res.closed)
        return

    // // return me full route in geom_way form
    // let fullRoute = await prisma.$queryRawUnsafe(`
    // select st_makeline($1)::text as geom_way
    // `, routes.map((route: any) => route.geom_way))
    // await prisma.$disconnect()
    // res.json(fullRoute)

    res.status(200).json(newRoutes)
}