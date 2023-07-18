export default async function handler(prisma: any, osm_id: string, signal: 'point' | 'polygon') {
    // change osm_id to bigInit
    let id = BigInt(osm_id)
    let result
    // prisma call
    if (signal === 'point')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select way as geometry from planet_osm_point
    where osm_id = $1),
    roads as (select name from planet_osm_line, point
        where boundary isnull and name notnull
        order by st_closestPoint(planet_osm_line.way, point.geometry) <-> point.geometry
        limit 1)
    select * from roads
    `, id)
    else if (signal === 'polygon')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select st_centroid(way) as geometry, way from planet_osm_polygon
    where osm_id = $1),
    roads as (select name from planet_osm_line, point
        where boundary isnull and name notnull
        order by st_closestPoint(planet_osm_line.way, point.way) <-> st_closestPoint(point.way, planet_osm_line.way)
        limit 1)
    select * from roads
    `, id)
    await prisma.$disconnect()
    return result
}