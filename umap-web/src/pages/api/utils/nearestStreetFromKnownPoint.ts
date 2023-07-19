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
    where st_dwithin(st_transform(point.geometry, 4326)::geography, st_transform(streets_forsearch.way, 4326),100)),
    best_road as (select near_street.highway, near_street.name, near_street.ward, near_street.district, near_street.way as way from near_street, point
    order by st_closestPoint(near_street.way, point.geometry) <-> point.geometry
    limit 1)
    select name from best_road
    `, id)
    else if (signal === 'polygon')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select st_centroid(planet_osm_polygon.way) as geometry from planet_osm_polygon
    where osm_id = $1),
    near_street as (select * from streets_forsearch, point
    where st_dwithin(st_transform(point.geometry, 4326)::geography, st_transform(streets_forsearch.way, 4326),100)),
    best_road as (select near_street.highway, near_street.name, near_street.ward, near_street.district, near_street.way as way from near_street, point
    order by st_closestPoint(near_street.way, point.geometry) <-> point.geometry
    limit 1)
    select name from best_road
    `, id)
    await prisma.$disconnect()
    return result
}