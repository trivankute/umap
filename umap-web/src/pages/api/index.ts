import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import fs from "fs"
import { getParentDirectory } from "./updateMapData/getDates";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // prisma call
    const parentDirectory = getParentDirectory()
    const data = await prisma.$queryRawUnsafe(`select distinct(name) from planet_osm_line
    where name notnull and boundary isnull`)
    fs.writeFileSync(parentDirectory + '\\src\\pages\\api\\line_name.json',JSON.stringify(data))
    // write data down
    // res.status(200).json(data)
}