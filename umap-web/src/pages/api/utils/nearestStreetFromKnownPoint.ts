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
    best_road as (select streets_forsearch.highway, streets_forsearch.street_way as name, streets_forsearch.ward, streets_forsearch.district, streets_forsearch.street_way as way from streets_forsearch, point
    order by st_closestPoint(streets_forsearch.street_way, point.geometry) <-> point.geometry
    limit 1)
    select name from best_road
    `, id)
    else if (signal === 'polygon')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select st_centroid(planet_osm_polygon.way) as geometry from planet_osm_polygon
    where osm_id = $1),
    best_road as (select streets_forsearch.highway, streets_forsearch.street_way as name, streets_forsearch.ward, streets_forsearch.district, streets_forsearch.street_way as way from streets_forsearch, point
    order by st_closestPoint(streets_forsearch.street_way, point.geometry) <-> point.geometry
    limit 1)
    select name from best_road
    `, id)
    await prisma.$disconnect()
    return result
}