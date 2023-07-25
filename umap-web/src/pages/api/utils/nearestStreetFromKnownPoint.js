// signal is point or polygon
async function handler(prisma, osm_id, signal) {
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
    best_road as (select streets_forsearch.street as name, streets_forsearch.district as district, streets_forsearch.ward as ward, streets_forsearch.city as city, streets_forsearch.street_way as way from streets_forsearch, point
    order by st_closestPoint(streets_forsearch.street_way, point.geometry) <-> point.geometry
    limit 1)
    select name, ward, district, city from best_road
    `, id)
    else if (signal === 'polygon')
        result = await prisma.$queryRawUnsafe(`
    with
    point as
    (select st_centroid(planet_osm_polygon.way) as geometry from planet_osm_polygon
    where osm_id = $1),
    best_road as (select streets_forsearch.street as name, streets_forsearch.district as district, streets_forsearch.ward as ward, streets_forsearch.city as city, streets_forsearch.street_way as way from streets_forsearch, point
    order by st_closestPoint(streets_forsearch.street_way, point.geometry) <-> point.geometry
    limit 1)
    select name, ward, district, city from best_road
    `, id)
    await prisma.$disconnect()
    return result
}

module.exports = handler