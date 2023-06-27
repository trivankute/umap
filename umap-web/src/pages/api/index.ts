import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // call prisma raw
    const a = await prisma.$queryRawUnsafe(
    `
    select amenity from planet_osm_point
    order by levenshtein(lower(unaccent(name)), lower(unaccent('duong hung phu')))
    limit 10
    `
    )
    // return result
    res.status(200).json(a)
}