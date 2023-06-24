import { NextApiRequest, NextApiResponse } from "next";
import  {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    // use raw sql
    const a = await prisma.$queryRaw`
    with 
    point as (select 'SRID=4326;point(106.658019 10.74454244)'::geometry),
    point_point as (select "addr:housenumber","addr:street",name,way from planet_osm_point,point
    where boundary isnull and ("addr:housenumber" notnull or name notnull or "addr:street" notnull)
    order by st_transform(way,4326) <-> point.geometry
    limit 1),
    point_polygon as (select "addr:housenumber","addr:street",name,way from planet_osm_polygon,point
    where boundary isnull and ("addr:housenumber" notnull or name notnull or "addr:street" notnull)
    order by st_transform(st_centroid(way),4326) <-> point.geometry
    limit 1),
    roads as (select name from planet_osm_line, point
    where boundary isnull
    order by st_transform(way,4326) <-> point.geometry
    limit 1),
    wards as (select ward from wards_forsearch,point
    where st_contains(st_transform(ward_geometry,4326), point.geometry)
    limit 1),
    districts as (select district from districts_forsearch,point
    where st_contains(st_transform(district_geometry,4326), point.geometry)
    limit 1)
    
    select 
    point_point."addr:housenumber" as point_housenumber,
    point_point."addr:street" as point_street_if_location_exist,
    point_point.name as point_location_name,
    point_polygon."addr:housenumber" as polygon_housenumber,
    point_polygon."addr:street" as polygon_street_if_location_exist,
    point_polygon.name as polygon_location_name,
    roads.name as road_name_if_location_not_exist,
    wards.ward, districts.district, 
    st_x(st_transform(st_centroid(point_point.way),4326)) as point_lng,
    st_y(st_transform(st_centroid(point_point.way),4326)) as point_lat, 
    st_x(st_transform(st_centroid(point_polygon.way),4326)) as polygon_lng,
    st_y(st_transform(st_centroid(point_polygon.way),4326)) as polygon_lat,
    st_distance (point.geometry,st_transform(st_centroid(point_polygon.way),4326)) as toPolygon,
    st_distance (point.geometry,st_transform(st_centroid(point_point.way),4326)) as toPoint
    
    from point, point_point, point_polygon, roads, wards, districts
    `
    res.json(a)
}