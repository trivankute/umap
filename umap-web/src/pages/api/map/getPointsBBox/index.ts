import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '@/lib/prisma'

export default async function getPointsBBox(req: NextApiRequest, res: NextApiResponse) {
    // try {
    //     // console.log(prisma)
    //     const prisma = new PrismaClient()

    //     console.log("hi")
    //     const points = await prisma.planet_osm_point.findOne({
    //         where:{
    //             osm_id:'6732183129'
    //         }
    //     })
    //     res.status(200).json("points")
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({
    //         state:"failed",
    //         message:"Error fetching points"
    //     })
    // }
}