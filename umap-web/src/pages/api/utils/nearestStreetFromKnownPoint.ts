export default async function handler(prisma: any, osm_id: string, signal: 'point' | 'polygon') {
    // change osm_id to bigInit
    let id = BigInt(osm_id)
    let result
    // prisma call
    if (signal === 'point')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select planet_osm_point.way as geometry from planet_osm_point
    where osm_id = $1),
    near_street as (select * from streets_forsearch, point
    where st_dwithin(ST_GeomFromText(ST_AsText(point.geometry),4326)::geography, st_transform(streets_forsearch.way, 4326),100))
    select name from near_street, point
    order by st_closestPoint(st_transform(near_street.way,4326), point.geometry::geometry) <-> point.geometry
    limit 1
    `, id)
    else if (signal === 'polygon')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select st_centroid(planet_osm_polygon.way) as geometry from planet_osm_polygon
    where osm_id = $1),
    near_street as (select * from streets_forsearch, point
        where st_dwithin(ST_GeomFromText(ST_AsText(point.geometry),4326)::geography, st_transform(streets_forsearch.way, 4326),100))
    select name from near_street, point
    order by st_closestPoint(st_transform(near_street.way,4326), point.geometry::geometry) <-> point.geometry
    limit 1
    `, id)
    await prisma.$disconnect()
    return result
}