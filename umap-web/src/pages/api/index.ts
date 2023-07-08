import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getParentDirectory } from "./updateMapData/getDates";
import checkWardExist from "./utils/findWard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // prisma call
    // const parentDirectory = getParentDirectory()
    let result = await checkWardExist(prisma, 'Phường 14', 'Quận 10')
    await prisma.$disconnect()
    
    res.status(200).json(result)

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