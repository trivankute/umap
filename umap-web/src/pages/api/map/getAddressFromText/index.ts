import prisma from "@/lib/prisma";
// @ts-ignore
import levenshtein from "fast-levenshtein";
import { NextApiRequest, NextApiResponse } from "next";
import nearestStreetFromKnownPoint from "../../utils/nearestStreetFromKnownPoint";
import { getParentDirectory } from "../../updateMapData/getDates";
import { addressParserUrl } from "@/pages/fileUrlsConfig";
const { spawn } = require('child_process')

const addressParser = async (address: string) => {
    return new Promise((resolve, reject) => {
        let parentDirectory = getParentDirectory();
        const childProcess = spawn(parentDirectory + addressParserUrl);

        let result = '';

        childProcess.stdout.on('data', (data: any) => {
            let str = data.toString();
            if (str.includes('Result:')) {
                str = str.substring(str.indexOf('{'));
                str = str.substring(0, str.indexOf('}') + 1);
                result = JSON.parse(str);
            }
        });

        childProcess.stderr.on('data', (data: any) => {
            console.log(`stderr: ${data}`);
        });

        childProcess.on('exit', (code: any) => {
            console.log(`Child process exited with code ${code}`);
            resolve(result); // Resolve the Promise with the result
        });

        childProcess.stdin.write(`${address}\n`);
        childProcess.stdin.end();
    });
};

// custom req
interface CustomNextApiRequest extends NextApiRequest {
    // body
    body: {
        text: string;
    };
}

export default async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
    // addressParser work best if it is unaccented
    if (req.method === 'POST') {
        // get text
        const text: string = req.body.text
        if (!text) {
            res.status(400).json({
                state: "failed",
                message: "text must be provided"
            })
            return
        }
        // unaccent text before sending to addressParser
        const unaccentedText = await prisma.$queryRawUnsafe(`select unaccent(lower('${text}'))`)
        const unaccentedTextString = unaccentedText[0].unaccent
        // call addressParser
        const response: any = await addressParser(unaccentedTextString)
        let {
            house_number,
            house,
            road,
            suburb,
            city,
        }: {
            house_number?: string,
            house?: string,
            road?: string,
            suburb?: string,
            city?: string,
        } = response

        // process data before fetching from database
        let location_name: null | string = null
        if (house) {
            location_name = house
        }

        let address = ""
        if (house_number) {
            address = house_number
        }
        if (road) {
            if (address) {
                address += " " + road
            }
            else {
                address = road
            }
        }

        // suburd for viet nam always include phuong and quan like "phuong 12 quan 8", split it
        let ward = ""
        let district = ""
        if (suburb) {
            const suburbSplit = suburb.split(" ")
            if (suburbSplit.length === 4) {
                ward = suburbSplit[0] + " " + suburbSplit[1]
                district = suburbSplit[2] + " " + suburbSplit[3]
            }
            else if (suburbSplit.length === 3) {
                ward = suburbSplit[0]
                district = suburbSplit[1] + " " + suburbSplit[2]
            }
            else if (suburbSplit.length === 2) {
                ward = suburbSplit[0]
                district = suburbSplit[1]
            }
        }

        // console.log
        // console.log("ward = " + ward)
        // console.log("district = " + district)
        // console.log("address = " + address)
        // console.log("location_name = " + location_name)

        // for test
        ward = "phuong 4"
        district = "quan Tan Binh"
        address = " Đường Lê Bình"
        location_name = 'benh vien tan binh'

        // prisma call
        let points = await prisma.$queryRawUnsafe(`WITH
    specific_district as (
    select district, district_geometry from districts_forsearch
    order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
    limit 1),
    specific_ward as (select ward, ward_geometry from wards_forsearch, specific_district
    where st_contains(specific_district.district_geometry, ward_geometry)
    order by levenshtein(unaccent(lower(ward)), unaccent(lower($2)))
    limit 1),
    specific_roads as (select * from planet_osm_line,specific_ward
    where boundary isnull and name notnull and st_contains(specific_ward.ward_geometry, way)),
    specific_points as (select * from planet_osm_point,specific_ward
    where boundary isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) and st_contains(specific_ward.ward_geometry, way))

    select osm_id::text, "addr:housenumber", "addr:street", name from specific_points
    `, district, ward)
    
    // loop points and find the nearest street also fulfil null street by nearest street
    points = points.map(async (point: any) => {
        let nearestStreet
        if (!point["addr:street"]) {
            nearestStreet = await nearestStreetFromKnownPoint(prisma, point.osm_id, 'point'); //(point.osm_id)
            point["addr:street"] = nearestStreet[0].name
        }
        return point
    })
    // wait for all promises to resolve
    points = await Promise.all(points)

    // distance variable inside everypoint
    points = points.map(async (element: any) => {
        element.distance = await levenshtein.get(element["addr:housenumber"] + " " + element["addr:street"], address, { useCollator: true })
        let locationName_distance = 0
        if (location_name) {
            let element_name = element.name ? element.name : ""
            locationName_distance += await levenshtein.get(element_name, location_name, { useCollator: true })
        }
        else
            locationName_distance = 0
        element.locationName_distance = locationName_distance
        element.totalDistance = element.distance + element.locationName_distance
        return element
    })
    // wait for all promises to resolve
    points = await Promise.all(points)
    // sort result from least distance
    points.sort((a: any, b: any) => {
        return a.totalDistance - b.totalDistance
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////
    let polygons = await prisma.$queryRawUnsafe(`WITH
    specific_district as (
    select district, district_geometry from districts_forsearch
    order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
    limit 1),
    specific_ward as (select ward, ward_geometry from wards_forsearch, specific_district
    where st_contains(specific_district.district_geometry, ward_geometry)
    order by levenshtein(unaccent(lower(ward)), unaccent(lower($2)))
    limit 1),
    specific_roads as (select * from planet_osm_line,specific_ward
    where boundary isnull and name notnull and st_contains(specific_ward.ward_geometry, way)),
    specific_polygons as (select * from planet_osm_polygon,specific_ward
    where boundary isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) and st_contains(specific_ward.ward_geometry, way))

    select osm_id::text, "addr:housenumber", "addr:street", name from specific_polygons
    `, district, ward)

    // // loop polygons and find the nearest street also fulfil null street by nearest street
    polygons = polygons.map(async (polygon: any) => {
        let nearestStreet
        if (!polygon["addr:street"]) {
            nearestStreet = await nearestStreetFromKnownPoint(prisma, polygon.osm_id, 'polygon');
            polygon["addr:street"] = nearestStreet[0].name
        }
        return polygon
    })
    // // wait for all promises to resolve
    polygons = await Promise.all(polygons)

    // distance variable inside everypoint
    polygons = polygons.map(async (element: any) => {
        element.distance = await levenshtein.get(element["addr:housenumber"] + " " + element["addr:street"], address, { useCollator: true })
        let locationName_distance = 0
        if (location_name) {
            let element_name = element.name ? element.name : ""
            locationName_distance += await levenshtein.get(element_name, location_name, { useCollator: true })
        }
        else
            locationName_distance = 0
        element.locationName_distance = locationName_distance
        element.totalDistance = element.distance + element.locationName_distance
        return element
    })
    // wait for all promises to resolve
    polygons = await Promise.all(polygons)
    // sort result from least distance
    polygons.sort((a: any, b: any) => {
        return a.totalDistance - b.totalDistance
    })


    // compare the first element of points and polygons in totalDistance term
    let result
    if (points[0].totalDistance < polygons[0].totalDistance) {
        result = points[0]
        result.type = 'point'
    }
    else {
        result = polygons[0]
        result.type = 'polygon'
    }
    // res.status(200).json({
    //     state: "success",
    //     message: "Your request is successful",
    //     data: result
    // })

    // full address?, type building?, lat lng?
    // lat lng
    // turn osm_id to bigInit
    let id = BigInt(result.osm_id)
    if(result.type==='point')
    {
        let latlng = await prisma.$queryRawUnsafe(`select 
        st_y(st_transform(way,4326)) as lat, 
        st_x(st_transform(way,4326)) as lng from planet_osm_point where osm_id = $1`, id)
        result.lat = latlng[0].lat
        result.lng = latlng[0].lng
        // return
        res.status(200).json({
            state: "success",
            message: "Your request is successful",
            data: result
        })
    }
    else if(result.type==='polygon')
    {
        let latlng = await prisma.$queryRawUnsafe(`select 
        st_y(st_transform(st_centroid(way),4326)) as lat, 
        st_x(st_transform(st_centroid(way),4326)) as lng from planet_osm_polygon where osm_id = $1`, id)
        result.lat = latlng[0].lat
        result.lng = latlng[0].lng
        // return
        res.status(200).json({
            state: "success",
            message: "Your request is successful",
            data: result
        })
    }

    }
    else {
        res.status(400).json({
            state: "failed",
            message: "Your request is rejected"
        })
        return
    }
}