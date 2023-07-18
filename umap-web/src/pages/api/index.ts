import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getParentDirectory } from "./updateMapData/getDates";
import checkWardExist from "./utils/findWard";
import findStreet from "./utils/findStreet";
import { Result } from "postcss";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // prisma call
    // const parentDirectory = getParentDirectory()
    // res.status(200).json(result)
    // with
    // point as (select st_setsrid(st_geomfromtext('POINT(106.657867 10.744576)')::geography,4326))
    // select * from streets_forsearch, point
    // where st_dwithin(point.st_setsrid, st_transform(streets_forsearch.way, 4326),10)
//     with
// point as (select st_setsrid(st_geomfromtext('POINT(106.657867 10.744576)')::geography ,4326) as geometry),
// near_street as (select * from streets_forsearch, point
// where st_dwithin(point.geometry, st_transform(streets_forsearch.way, 4326),50))
	
// select name, ward, district, way from near_street, point
// order by st_closestPoint(st_transform(near_street.way,4326), point.geometry::geometry) <-> point.geometry
// limit 1
    // const result = await prisma.$queryRawUnsafe(`
    // create table streets_forsearch as 
    // (
    // with
    // ward_district as (select ward, district, ward_geometry, district_geometry from wards_forsearch, districts_forsearch
    // where st_contains(district_geometry, ward_geometry))
    // select highway, name, ward, district, planet_osm_line.way from planet_osm_line, ward_district
    // where name notnull and boundary isnull and admin_level isnull 
	// and st_contains(ward_geometry, way)
    // )
    // `)
    // await prisma.$disconnect()
    // res.status(200).json("done")
    // const result = await prisma.$queryRawUnsafe(`
    // with
    // point as (select st_setsrid(st_geomfromtext($1)::geography ,4326) as geometry),
    // near_street as (select * from streets_forsearch, point
    // where st_dwithin(point.geometry::geometry, st_transform(streets_forsearch.way, 4326),50))
    
    // select geometry from point
    // `, "POINT(" + lng + " " + lat + ")");
    // await prisma.$disconnect()
    // res.status(200).json(result)

    let lat = "10.74482"
    let lng = "106.65523205736757"
    const result = await prisma.$queryRawUnsafe(`
    with 
point as (select st_setsrid(st_geomfromtext('POINT(106.65516  10.744393345562086)')::geometry, 4326) as geometry),
point_geography as (select st_setsrid(st_geomfromtext('POINT(106.65516  10.744393345562086)')::geography, 4326) as geometry),
point_point as (select osm_id, "addr:housenumber","addr:street",name,way, amenity, shop, tourism, historic from planet_osm_point,point
where boundary isnull and ("addr:housenumber" notnull or name notnull or "addr:street" notnull)
order by st_transform(way,4326) <-> point.geometry
limit 1),
point_polygon as (select osm_id, "addr:housenumber","addr:street",name,way, landuse, building, amenity, leisure, shop from planet_osm_polygon,point
where boundary isnull and ("addr:housenumber" notnull or name notnull or "addr:street" notnull)
order by st_closestPoint(st_transform(way,4326), point.geometry) <-> point.geometry
limit 1),
near_street as (select * from streets_forsearch, point_geography
where st_dwithin(point_geography.geometry, st_transform(streets_forsearch.way, 4326),100)),
best_road as (select near_street.highway, near_street.name, near_street.ward, near_street.district, near_street.way as way from near_street, point
order by st_closestPoint(st_transform(near_street.way,4326), point.geometry) <-> point.geometry
limit 1)

select 
point_point.osm_id::text as point_osm_id,
point_point."addr:housenumber" as point_housenumber,
point_point."addr:street" as point_street,
point_point.name as point_location_name,
point_point.amenity as point_amenity,
point_point.shop as point_shop,
point_point.tourism as point_tourism,
point_point.historic as point_historic,
point_polygon.osm_id::text as polygon_osm_id,
point_polygon."addr:housenumber" as polygon_housenumber,
point_polygon."addr:street" as polygon_street,
point_polygon.name as polygon_location_name,
point_polygon.building as polygon_building,
point_polygon.landuse as polygon_landuse,   
point_polygon.amenity as polygon_amenity,
point_polygon.leisure as polygon_leisure,
point_polygon.shop as polygon_shop,
best_road.name as road_name,
best_road.highway as road_highway,
best_road.ward, best_road.district, 
st_x(st_transform(st_centroid(point_point.way),4326)) as point_lng,
st_y(st_transform(st_centroid(point_point.way),4326)) as point_lat, 
st_x(st_transform(st_centroid(point_polygon.way),4326)) as polygon_lng,
st_y(st_transform(st_centroid(point_polygon.way),4326)) as polygon_lat,
st_x(st_transform(st_centroid(best_road.way),4326)) as road_lng,
st_y(st_transform(st_centroid(best_road.way),4326)) as road_lat,
st_distance (st_transform(point.geometry, 4326),st_transform(st_centroid(point_polygon.way),4326)) as toPolygon,
st_distance (st_transform(point.geometry, 4326),st_transform(point_point.way,4326)) as toPoint,
st_distance (st_transform(point.geometry, 4326),st_transform(st_centroid(best_road.way),4326)) as toRoad

from point, point_point, point_polygon, best_road
    `, "POINT(" + lng + " " + lat + ")")
    await prisma.$disconnect()
    res.json(result)

    // const polygons = await prisma.$queryRawUnsafe(`
    // WITH
    // specific_district as (
    // select district, district_geometry from districts_forsearch
    // order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
    // limit 1),
    // specific_ward as (select ward, ward_geometry from wards_forsearch, specific_district
    // where st_contains(specific_district.district_geometry, ward_geometry)
    // order by levenshtein(unaccent(lower(ward)), unaccent(lower($2)))
    // limit 1)
    // select osm_id::text,"addr:housenumber", "addr:street",name,st_x(st_transform(st_centroid(way),4326)),st_y(st_transform(st_centroid(way),4326))
    // from planet_osm_polygon, specific_ward
    // where (name notnull or "addr:housenumber" notnull or "addr:street" notnull) and st_contains(specific_ward.ward_geometry, planet_osm_polygon.way)`, "Quận 10", 'Phường 14')

    // const points = await prisma.$queryRawUnsafe(`
    // WITH
    //     specific_district as (
    //     select district, district_geometry from districts_forsearch
    //     order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
    //     limit 1)
    // select osm_id::text,"addr:housenumber", "addr:street",name,st_x(st_transform(st_centroid(way),4326)),st_y(st_transform(st_centroid(way),4326))
    // from planet_osm_point, specific_district
    // where (name notnull or "addr:housenumber" notnull or "addr:street" notnull) and st_contains(specific_district.district_geometry, planet_osm_point.way)`, "Quận 10")

    // name = 'Trường Đại học Bách khoa TP.HCM'`, "Quận 10"
    // write data down
    // res.status(200).json(polygons)
}