import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
interface NextRoutingRequest extends NextRequest {
    query: {
        lng1: number,
        lat1: number,
        lng2: number,
        lat2: number
    }
}

export default async function handler(req: NextRoutingRequest, res: any) {
    const { lng1, lat1, lng2, lat2 } = req.query
    // check validation
    if(!lng1 || !lat1 || !lng2 || !lat2)
    {
        res.status(400).json({message: 'You must provide all lng1, lat1, lng2, lat2'})
        return
    }
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

    let endPoint = await prisma.$queryRawUnsafe(`
    with 
    endPoint as
    (select ST_SetSRID(
    ST_GeomFromText('POINT (${lng2} ${lat2})'),
    4326) as geometry)
        select geometry::text from endPoint
    `)
    await prisma.$disconnect()

    let nearStartPoint = await prisma.$queryRawUnsafe(`
    with 
    nearStartPoint as (select st_closestPoint(st_transform(planet_osm_line.way,4326), $1) as start_geometry from planet_osm_line
    where boundary isnull and name notnull
    order by st_closestPoint(st_transform(planet_osm_line.way,4326), $1) <-> $1
    limit 1)
    select start_geometry::text from nearStartPoint
    `, startPoint[0].geometry)
    await prisma.$disconnect()

    let nearEndPoint = await prisma.$queryRawUnsafe(`
    with
    nearEndPoint as (select st_closestPoint(st_transform(planet_osm_line.way,4326), $1) as end_geometry from planet_osm_line
    where boundary isnull and name notnull
    order by st_closestPoint(st_transform(planet_osm_line.way,4326), $1) <-> $1
    limit 1)
    select end_geometry::text from nearEndPoint
    `, endPoint[0].geometry)
    await prisma.$disconnect()

    let routes = await prisma.$queryRawUnsafe(`
    with
    -- find he nearest vertex to the start longitude/latitude
    start AS (
    SELECT topo.source --could also be topo.target
    FROM lisbon_2po_4pgr as topo
    ORDER BY topo.geom_way <-> $1
    LIMIT 1
    ),
    -- find the nearest vertex to the destination longitude/latitude
    destination AS (
    SELECT topo.source --could also be topo.target
    FROM lisbon_2po_4pgr as topo
    ORDER BY topo.geom_way <-> $2
    LIMIT 1
    ),
    -- use Dijsktra and join with the geometries
    directedTable as (SELECT *
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
    ON di.edge = topo.id)
    select osm_name, km, geom_way::text from directedTable
    `, nearStartPoint[0].start_geometry, nearEndPoint[0].end_geometry)

    // line from start point to near start point
    let lineFromStartPoint = await prisma.$queryRawUnsafe(`
    select st_makeline($1, $2)::text as geometry
    `, startPoint[0].geometry, nearStartPoint[0].start_geometry)
    await prisma.$disconnect()

    // line from end point to near end point
    let lineFromEndPoint = await prisma.$queryRawUnsafe(`
    select st_makeline($1, $2)::text as geometry
    `, nearEndPoint[0].end_geometry, endPoint[0].geometry)
    await prisma.$disconnect()

    // check if the line from start point to near start point intersects with the route
    let intersectAtStart = await prisma.$queryRawUnsafe(`
    select ST_Intersects($1, $2)`,
        routes[0].geom_way, lineFromStartPoint[0].geometry)
    await prisma.$disconnect()

    // check if the line from end point to near end point intersects with the route
    let intersectAtEnd = await prisma.$queryRawUnsafe(`
    select ST_Intersects($1, $2)`,
        routes[routes.length - 1].geom_way, lineFromEndPoint[0].geometry)
    await prisma.$disconnect()

    // time to connect the routes if they intersect at start
    if (intersectAtStart[0].st_intersects === true) {
        // prepare to replace the routes[0]
        let lineConnectAtStart = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), st_startpoint($2))::text as geometry
        `, lineFromStartPoint[0].geometry, routes[1].geom_way)
        await prisma.$disconnect()
        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtStart[0].geometry)
        await prisma.$disconnect()

        // replace the routes[0]
        routes[0] = {
            osm_name: 'near_start',
            km: length[0].length / 1000,
            geom_way: lineConnectAtStart[0].geometry
        }
    }
    else {
        // prepare to unshift the routes[0]
        let lineConnectAtStart = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), st_startpoint($2))::text as geometry
        `, lineFromStartPoint[0].geometry, routes[0].geom_way)
        await prisma.$disconnect()

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtStart[0].geometry)
        await prisma.$disconnect()

        // unshift the routes[0] for lineConnectAtStart
        routes.unshift({
            osm_name: 'start',
            km: length[0].length / 1000,
            geom_way: lineConnectAtStart[0].geometry
        })
    }
    // add line from start point to near start point
    routes.unshift({
        osm_name: 'start',
        km: 0,
        geom_way: lineFromStartPoint[0].geometry
    })

    // time to connect the routes if they intersect at end
    if (intersectAtEnd[0].st_intersects === true) {
        // prepare to replace the routes[routes.length - 1]
        let lineConnectAtEnd = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), st_startpoint($2))::text as geometry
        `, routes[routes.length - 2].geom_way, lineFromEndPoint[0].geometry)
        await prisma.$disconnect()

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtEnd[0].geometry)
        await prisma.$disconnect()

        // replace the routes[routes.length - 1]
        routes[routes.length - 1] = {
            osm_name: 'near_end',
            km: length[0].length / 1000,
            geom_way: lineConnectAtEnd[0].geometry
        }
    }
    else {
        // prepare to push the routes[routes.length - 1]
        let lineConnectAtEnd = await prisma.$queryRawUnsafe(`
        select st_makeline(st_endpoint($1), st_startpoint($2))::text as geometry
        `, routes[routes.length - 1].geom_way, lineFromEndPoint[0].geometry)
        await prisma.$disconnect()

        // count length of the line
        let length = await prisma.$queryRawUnsafe(`
        select st_length(st_setsrid($1::geography,4326)) as length
        `, lineConnectAtEnd[0].geometry)
        await prisma.$disconnect()

        // push the routes[routes.length - 1] for lineConnectAtEnd
        routes.push({
            osm_name: 'near_end',
            km: length[0].length / 1000,
            geom_way: lineConnectAtEnd[0].geometry
        })
    }
    // add line from end point to near end point
    routes.push({
        osm_name: 'end',
        km: 0,
        geom_way: lineFromEndPoint[0].geometry
    })

    // add directions to the routes
    routes = await routes.map(async (route: any, index: number) => {
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
    })
    routes = await Promise.all(routes)

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
    newRoutes = await newRoutes.map(async (route: any) => {
        if(Array.isArray(route)) {
            let geojsonText = await prisma.$queryRawUnsafe(`
            select ST_MakeLine($1)::text as geojson`, route.map((r:any)=>r.geom_way))
            await prisma.$disconnect()
            let geojson = await prisma.$queryRawUnsafe(`
            select ST_AsGeoJSON($1) as geojson`, geojsonText[0].geojson)
            await prisma.$disconnect()
            let newLength = await route.reduce((acc:any, cur:any)=>acc+cur.km, 0)

            return {
                osm_name: route[0].osm_name,
                km: newLength,
                direction: route[0].direction,
                coors: JSON.parse(geojson[0].geojson).coordinates,
                geom_way: geojsonText[0].geojson
            }
        }
        else
        {
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
    })
    newRoutes = await Promise.all(newRoutes)

    res.status(200).json(newRoutes)
}