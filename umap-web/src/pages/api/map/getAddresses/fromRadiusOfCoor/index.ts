import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import forRadius from "../../../utils/forRadius/forRadius";

// custom req
interface CustomNextApiRequest extends NextApiRequest {
    query: {
        lng: string;
        lat: string;
        radius: string;
        typeBuilding?: string;
    };
}

export default async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
    if(req.method === 'GET') {
        // get lng and lat and radius from req.query
        const lng:string = req.query.lng
        const lat:string = req.query.lat
        const radius:number = parseInt(req.query.radius)
        const typeBuilding:string = req.query.typeBuilding||"all"
        
        if(!lng||!lat||!radius) {
            res.status(400).json({
                state:"failed",
                message:"lng and lat and radius must be provided"
            })
            return
        }
        // limit radius to 100m
        if (radius>100) {
            res.status(400).json({
                state:"failed",
                message:"radius must be less than 100m"
            })
            return
        }
    
        // find all points within 50m of this point
        const points:any = await prisma.$queryRawUnsafe(`with 
        point as (select $1::geography), 
        nearPoints as (
        select 
        main_table.way
        from planet_osm_point as main_table,point 
        where main_table.boundary isnull and (main_table.name notnull or main_table."addr:housenumber" notnull
                                             or main_table."addr:street" notnull)
            and st_dwithin(point.geography, st_transform(st_centroid(main_table.way),4326),$2)
        )
        
        select st_x(st_transform(way,4326)) as lng, st_y(st_transform(way,4326)) as lat
         from nearPoints
        `, "SRID=4326;POINT("+lng+" "+lat+")", radius)
        await prisma.$disconnect()
    
        // find all polygons within 50m of this point
        const polygons:any = await prisma.$queryRawUnsafe(`with
        point as (select $1::geography),
        nearPolygons as (
        select
        main_table.way
        from planet_osm_polygon as main_table,point
        where main_table.boundary isnull and (main_table.name notnull or main_table."addr:housenumber" notnull
                                                or main_table."addr:street" notnull)
            and st_dwithin(point.geography, st_transform(st_centroid(main_table.way),4326),$2)
        )
    
        select st_x(st_transform(st_centroid(way),4326)) as lng, st_y(st_transform(st_centroid(way),4326)) as lat
        from nearPolygons
        `, "SRID=4326;POINT("+lng+" "+lat+")", radius)
        await prisma.$disconnect()
        
        // // use nearestAddress to convert these lng and lat of points and polygons to addresses
        let results:any = await forRadius(points, polygons)
        // if typeBuilding is not all, filter results
        if (typeBuilding!=="all") {
            results = results.filter((result:any)=>result.type===typeBuilding)
        }
        await prisma.$disconnect()
        // return these points and polygons
        res.status(200).json({
            state:"success",
            message:"Your request is accepted",
            data:results
        })
        return
    }
    else 
    {
        res.status(400).json({
            state:"failed",
            message:"Your request is rejected"
        })
        return
    }
}