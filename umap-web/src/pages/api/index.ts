import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getParentDirectory } from "./updateMapData/getDates";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // prisma call
    const parentDirectory = getParentDirectory()
    const data = await prisma.$queryRawUnsafe(`
    WITH
        specific_district as (
        select district, district_geometry from districts_forsearch
        order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
        limit 1)
    select osm_id,name,st_x(st_transform(st_centroid(way),4326)),st_y(st_transform(st_centroid(way),4326)), 
    st_contains(specific_district.district_geometry, planet_osm_polygon.way) from planet_osm_polygon, specific_district
    where name = 'Trường Đại học Bách khoa TP.HCM'`, "Quận 10")
    console.log(data)
    // write data down
    // res.status(200).json(data)
}