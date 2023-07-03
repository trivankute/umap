import prisma from "@/lib/prisma";
// @ts-ignore
import levenshtein from "fast-levenshtein";
import { NextApiRequest, NextApiResponse } from "next";
import nearestStreetFromKnownPoint from "../../../utils/nearestStreetFromKnownPoint";
import { getParentDirectory } from "../../../updateMapData/getDates";
import addressParser from '@/pages/api/addressParser/'
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
        let resultOfParser = await addressParser(text)
        console.log(resultOfParser)
        // let {
        //     housenumber, housename, street, ward, district, city
        // } = resultOfParser

        // // process data before fetching from database
        // let location_name: null | string = null
        // if (housename) {
        //     if (typeof housename === 'string')
        //         location_name = housename
        // }

        // let address = ""
        // if (housenumber) {
        //     // check if housenumber is string
        //     if (typeof housenumber === 'string') {
        //         address = housenumber
        //     }
        // }
        // if (street) {
        //     if (typeof street === 'string') {
        //         if (address) {
        //             address += " " + street
        //         }
        //         else {
        //             address = street
        //         }
        //     }
        //     else {

        //     }
        // }

        // if (typeof ward !== 'string' || typeof district !== 'string' || typeof street !== 'string') {
        //     res.status(400).json({
        //         state: "failed",
        //         message: "Can't regconize your address, please fill at least ward, district and street"
        //     })
        //     return
        // }

        // // // console.log
        // console.log("ward = " + ward)
        // console.log("district = " + district)
        // console.log("address = " + address)
        // console.log("location_name = " + location_name)

//         // for test
//         // ward = "Phường 15"
//         // district = "Quận 11"
//         // address = null
//         // location_name = 'Trường Đại học Bách khoa TP.HCM'

//         // prisma call
//         ////////////////////////////////// old version
//             let points = await prisma.$queryRawUnsafe(`WITH
//         specific_district as (
//         select district, district_geometry from districts_forsearch
//         order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
//         limit 1),
//         specific_ward as (select ward, ward_geometry from wards_forsearch, specific_district
//         where st_contains(specific_district.district_geometry, ward_geometry)
//         order by levenshtein(unaccent(lower(ward)), unaccent(lower($2)))
//         limit 1),
//         specific_roads as (select * from planet_osm_line,specific_ward
//         where boundary isnull and name notnull and st_contains(specific_ward.ward_geometry, way)),
//         specific_points as (select * from planet_osm_point,specific_ward
//         where boundary isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) and st_contains(specific_ward.ward_geometry, way))

//         select osm_id::text, "addr:housenumber", "addr:street", name from specific_points
//         `, district, ward)
//         /////////////////////////////////////////////////// new version
// //         let points = await prisma.$queryRawUnsafe(`WITH
// //         specific_district as (
// //             select district, district_geometry from districts_forsearch
// //             order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
// //             limit 1),
// //         specific_points as (select * from planet_osm_point, specific_district
// //         where boundary isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) and st_contains(specific_district.district_geometry, way))

// //         select osm_id::text, "addr:housenumber", "addr:street", name from specific_points
// // `, district, ward)

//         // loop points and find the nearest street also fulfil null street by nearest street
//         points = points.map(async (point: any) => {
//             let nearestStreet
//             if (!point["addr:street"]) {
//                 nearestStreet = await nearestStreetFromKnownPoint(prisma, point.osm_id, 'point'); //(point.osm_id)
//                 point["addr:street"] = nearestStreet[0].name
//             }
//             return point
//         })
//         // wait for all promises to resolve
//         points = await Promise.all(points)

//         // distance variable inside everypoint
//         points = points.map(async (element: any) => {
//             element.distance = await levenshtein.get(element["addr:housenumber"] + " " + element["addr:street"], address, { useCollator: true })
//             // console.log(element["addr:housenumber"] + " " + element["addr:street"], " / ", address)
//             let locationName_distance = 0
//             if (location_name) {
//                 let element_name = element.name ? element.name : ""
//                 locationName_distance += await levenshtein.get(element_name, location_name, { useCollator: true })
//                 // console.log(element_name, location_name)
//             }
//             else
//                 locationName_distance = 0
//             element.locationName_distance = locationName_distance
//             element.totalDistance = element.distance + element.locationName_distance
//             return element
//         })
//         // wait for all promises to resolve
//         points = await Promise.all(points)
//         // sort result from least distance
//         points.sort((a: any, b: any) => {
//             return a.totalDistance - b.totalDistance
//         })
//         /////////////////////////////////////////////////////////////////////////////////////////////////
//         ///////////////////////////// old version
//             let polygons = await prisma.$queryRawUnsafe(`WITH
//         specific_district as (
//         select district, district_geometry from districts_forsearch
//         order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
//         limit 1),
//         specific_ward as (select ward, ward_geometry from wards_forsearch, specific_district
//         where st_contains(specific_district.district_geometry, ward_geometry)
//         order by levenshtein(unaccent(lower(ward)), unaccent(lower($2)))
//         limit 1),
//         specific_roads as (select * from planet_osm_line,specific_ward
//         where boundary isnull and name notnull and st_contains(specific_ward.ward_geometry, way)),
//         specific_polygons as (select * from planet_osm_polygon,specific_ward
//         where boundary isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) and st_contains(specific_ward.ward_geometry, way))

//         select osm_id::text, "addr:housenumber", "addr:street", name from specific_polygons
//         `, district, ward)
//         /////////////////////////////////////////////////// new version
//         // let polygons = await prisma.$queryRawUnsafe(`WITH
//         // specific_district as (
//         // select district, district_geometry from districts_forsearch
//         // order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
//         // limit 1),
//         // specific_polygons as (select * from planet_osm_polygon,specific_district
//         // where boundary isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) and st_contains(specific_district.district_geometry, way))
    
//         // select osm_id::text, "addr:housenumber", "addr:street", name from specific_polygons
//         // `, district, ward)

//         // // loop polygons and find the nearest street also fulfil null street by nearest street
//         polygons = polygons.map(async (polygon: any) => {
//             let nearestStreet
//             if (!polygon["addr:street"]) {
//                 nearestStreet = await nearestStreetFromKnownPoint(prisma, polygon.osm_id, 'polygon');
//                 polygon["addr:street"] = nearestStreet[0].name
//             }
//             return polygon
//         })
//         // // wait for all promises to resolve
//         polygons = await Promise.all(polygons)

//         // distance variable inside everypoint
//         polygons = polygons.map(async (element: any) => {
//             element.distance = await levenshtein.get(element["addr:housenumber"] + " " + element["addr:street"], address, { useCollator: true })
//             // console.log(element["addr:housenumber"] + " " + element["addr:street"], " / ", address)
//             let locationName_distance = 0
//             if (location_name) {
//                 let element_name = element.name ? element.name : ""
//                 locationName_distance += await levenshtein.get(element_name, location_name, { useCollator: true })
//                 // console.log(element_name, location_name)
//             }
//             else
//                 locationName_distance = 0
//             element.locationName_distance = locationName_distance
//             element.totalDistance = element.distance + element.locationName_distance
//             return element
//         })
//         // wait for all promises to resolve
//         polygons = await Promise.all(polygons)
//         // sort result from least distance
//         polygons.sort((a: any, b: any) => {
//             return a.totalDistance - b.totalDistance
//         })

//         ////////////////////////////////////////////// version 10 stuff
//         let result = []
//         // get 10 highest totalDistance from both merged array of points polygons
//         let pointIndex = 0
//         let polygonIndex = 0
//         // until result length = 10 not stop
//         while (result.length < 10 && pointIndex < points.length && polygonIndex < polygons.length) {
//             // if both points and polygons are not empty
//             if (pointIndex < points.length && polygonIndex < polygons.length) {
//                 // compare totalDistance
//                 if (points[pointIndex].totalDistance < polygons[polygonIndex].totalDistance) {
//                     // if points totalDistance is smaller, push it to result
//                     // add typeOfShape
//                     points[pointIndex].typeOfShape = 'point'
//                     result.push(points[pointIndex])
//                     pointIndex++
//                 }
//                 else {
//                     // if polygons totalDistance is smaller, push it to result
//                     // add typeOfShape
//                     polygons[polygonIndex].typeOfShape = 'polygon'
//                     result.push(polygons[polygonIndex])
//                     polygonIndex++
//                 }
//             }
//             // if points is empty
//             else if (pointIndex >= points.length) {
//                 // push polygons to result
//                 polygons[polygonIndex].typeOfShape = 'polygon'
//                 result.push(polygons[polygonIndex])
//                 polygonIndex++
//             }
//             // if polygons is empty
//             else if (polygonIndex >= polygons.length) {
//                 // push points to result
//                 points[pointIndex].typeOfShape = 'point'
//                 result.push(points[pointIndex])
//                 pointIndex++
//             }
//         }
//         // loop result and get lat lng
//         result = result.map(async (element: any) => {
//             let forResult
//             if (element.typeOfShape === 'point') {
//                 // turn osm_id to bigInit
//                 let id = BigInt(element.osm_id)
//                 forResult = await prisma.$queryRawUnsafe(`select 
//                 amenity, shop, tourism, historic,
//                 st_y(st_transform(way,4326)) as lat, 
//                 st_x(st_transform(way,4326)) as lng from planet_osm_point where osm_id = $1`, id)
//                 // for type
//                 let type = ""
//                 if (forResult[0].amenity) {
//                     type = forResult[0].amenity
//                 }
//                 else if (forResult[0].shop) {
//                     type = forResult[0].shop
//                 }
//                 else if (forResult[0].tourism) {
//                     type = forResult[0].tourism
//                 }
//                 else if (forResult[0].historic) {
//                     type = forResult[0].historic
//                 }
//                 else if (type === "" && element["addr:housenumber"]) {
//                     type = "house"
//                 }
//                 else if (type === "") {
//                     type = "unknown"
//                 }
//                 element.type = type
//             }
//             else if (element.typeOfShape === 'polygon') {
//                 // turn osm_id to bigInit
//                 let id = BigInt(element.osm_id)
//                 forResult = await prisma.$queryRawUnsafe(`select 
//                 landuse, building, amenity, leisure, shop,
//                 st_y(st_transform(st_centroid(way),4326)) as lat, 
//                 st_x(st_transform(st_centroid(way),4326)) as lng from planet_osm_polygon where osm_id = $1`, id)
//                 // for type
//                 let type = ""
//                 if (forResult[0].building && forResult[0].building !== "yes") {
//                     type = forResult[0].building
//                 }
//                 else if (forResult[0].amenity) {
//                     type = forResult[0].amenity
//                 }
//                 else if (forResult[0].landuse) {
//                     type = forResult[0].landuse
//                 }
//                 else if (forResult[0].leisure) {
//                     type = forResult[0].leisure
//                 }
//                 else if (forResult[0].shop) {
//                     type = forResult[0].shop
//                 }
//                 else if (type === "") {
//                     type = "unknown"
//                 }
//                 element.type = type
//             }
//             element.lat = forResult[0].lat
//             element.lng = forResult[0].lng
//             let fullAddress = ''
//             if (element["name"]) {
//                 fullAddress += element["name"]
//             }
//             if (element["addr:housenumber"]) {
//                 fullAddress += ' ' + element["addr:housenumber"]
//             }
//             if (element["addr:street"]) {
//                 fullAddress += ' ' + element["addr:street"]
//             }
//             // add ward and district
//             if (ward) {
//                 fullAddress += ', ' + ward
//             }
//             if (district) {
//                 fullAddress += ', ' + district
//             }
//             // add city
//             fullAddress += ', ' + "Thành phố Hồ Chí Minh"
//             element.fullAddress = fullAddress

//             return {
//                 osm_id: element.osm_id,
//                 address: element.fullAddress,
//                 type: element.type,
//                 typeOfShape: element.typeOfShape,
//                 lat: element.lat,
//                 lng: element.lng
//             }
//         }
//         )
//         // wait for all promises to resolve
//         result = await Promise.all(result)
//         res.status(200).json({
//             state: "success",
//             message: "Your request is successful",
//             data: result
//         })
    }
    else {
        res.status(400).json({
            state: "failed",
            message: "Your request is rejected"
        })
        return
    }
}