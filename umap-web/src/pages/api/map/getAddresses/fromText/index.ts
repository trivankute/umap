import prisma from "@/lib/prisma";
// @ts-ignore
import levenshtein from "fast-levenshtein";
import { NextApiRequest, NextApiResponse } from "next";
import nearestStreetFromKnownPoint from "../../../utils/nearestStreetFromKnownPoint";
import { getParentDirectory } from "../../../updateMapData/getDates";
import addressParser from '@/pages/api/addressParser/'
import findWard from "@/pages/api/utils/findWard";
import findDistrict from "@/pages/api/utils/findDistrict";
import findStreet from "@/pages/api/utils/findStreet";
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
                message: "Address must be provided"
            })
            return
        }
        let resultOfParser = await addressParser(text)
        let {
            housenumber, housename, street, ward, district, city
        } = resultOfParser
        // console.log(resultOfParser)
        //////////////////////////////////////// true attribute return by addreeParser because of
        ///////////////////// obey the rule of address in vietname
        ///////////// if any case is type boolean, turn true to false
        if (typeof housenumber === 'boolean') {
            housenumber = false
        }
        if (typeof housename === 'boolean') {
            housename = false
        }
        if (typeof street === 'boolean') {
            street = false
        }
        if (typeof ward === 'boolean') {
            ward = false
        }
        if (typeof district === 'boolean') {
            district = false
        }
        // console.log(housenumber, housename, street, ward, district)
        let searchMode = ''
        if (housenumber || housename) {
            if (street && ward && district)
                searchMode = 'full'
            else if (!street || !district || !ward) {
                res.status(400).json({
                    state: "failed",
                    message: "Can't regconize your address by lacking of ward or district or street"
                })
            }
        }
        else if (!housenumber && !housename && street) {
            // if (ward && district)
            //     searchMode = 'street'
            // else if (!ward || !district) {
            //     res.status(400).json({
            //         state: "failed",
            //         message: "Can't regconize what part of your street by lacking of ward or district"
            //     })
            // }
            searchMode = 'street'
        }
        else if (!street && ward) {
            if (district)
                searchMode = 'ward'
            else if (!district) {
                res.status(400).json({
                    state: "failed",
                    message: "Can't regconize which ward by lacking of district"
                })
            }
        }
        else if (!ward && district) {
            searchMode = 'district'
        }
        ///////////////////////////////////////////////// start searching full
        if (searchMode === 'full') {
            // process data before fetching from database
            let location_name: null | string = null
            if (housename) {
                location_name = housename
            }

            let address = ""
            if (housenumber) {
                address = housenumber
            }
            if (street) {
                if (address) {
                    address += " " + street
                }
                else {
                    address = street
                }
            }

            // // console.log
            console.log("ward = " + ward)
            console.log("district = " + district)
            console.log("address = " + address)
            console.log("location_name = " + location_name)

            ////////////////////// check if district contain ward or not
            // @ts-ignore
            let resultCheckWard = await findWard(prisma, ward, district)
            if (resultCheckWard.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `Ward ${ward} in district ${district} is not exist`
                })
                return
            }
            // prisma call
            ////////////////////////////////// old version
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
                // console.log(element["addr:housenumber"] + " " + element["addr:street"], " / ", address)
                let locationName_distance = 0
                if (location_name) {
                    let element_name = element.name ? element.name : ""
                    locationName_distance += await levenshtein.get(element_name, location_name, { useCollator: true })
                    // console.log(element_name, location_name)
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
            ///////////////////////////// old version
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
                // console.log(element["addr:housenumber"] + " " + element["addr:street"], " / ", address)
                let locationName_distance = 0
                if (location_name) {
                    let element_name = element.name ? element.name : ""
                    locationName_distance += await levenshtein.get(element_name, location_name, { useCollator: true })
                    // console.log(element_name, location_name)
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

            ////////////////////////////////////////////// version 10 stuff
            let result = []
            // get 10 highest totalDistance from both merged array of points polygons
            let pointIndex = 0
            let polygonIndex = 0
            // until result length = 10 not stop
            while (result.length < 10 && pointIndex < points.length && polygonIndex < polygons.length) {
                // if both points and polygons are not empty
                if (pointIndex < points.length && polygonIndex < polygons.length) {
                    // compare totalDistance
                    if (points[pointIndex].totalDistance < polygons[polygonIndex].totalDistance) {
                        // if points totalDistance is smaller, push it to result
                        // add typeOfShape
                        points[pointIndex].typeOfShape = 'point'
                        result.push(points[pointIndex])
                        pointIndex++
                    }
                    else {
                        // if polygons totalDistance is smaller, push it to result
                        // add typeOfShape
                        polygons[polygonIndex].typeOfShape = 'polygon'
                        result.push(polygons[polygonIndex])
                        polygonIndex++
                    }
                }
                // if points is empty
                else if (pointIndex >= points.length) {
                    // push polygons to result
                    polygons[polygonIndex].typeOfShape = 'polygon'
                    result.push(polygons[polygonIndex])
                    polygonIndex++
                }
                // if polygons is empty
                else if (polygonIndex >= polygons.length) {
                    // push points to result
                    points[pointIndex].typeOfShape = 'point'
                    result.push(points[pointIndex])
                    pointIndex++
                }
            }
            // loop over result and delete if totalDistance >10
            result = result.filter((element: any) => {
                return element.totalDistance <= 10
            })
            if(result.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: "Not found any address match your request"
                })
                return
            }

            // loop result and get lat lng
            result = result.map(async (element: any) => {
                let forResult
                if (element.typeOfShape === 'point') {
                    // turn osm_id to bigInit
                    let id = BigInt(element.osm_id)
                    forResult = await prisma.$queryRawUnsafe(`select 
                        amenity, shop, tourism, historic,
                        st_y(st_transform(way,4326)) as lat, 
                        st_x(st_transform(way,4326)) as lng from planet_osm_point where osm_id = $1`, id)
                    // for type
                    let type = ""
                    if (forResult[0].amenity) {
                        type = forResult[0].amenity
                    }
                    else if (forResult[0].shop) {
                        type = forResult[0].shop
                    }
                    else if (forResult[0].tourism) {
                        type = forResult[0].tourism
                    }
                    else if (forResult[0].historic) {
                        type = forResult[0].historic
                    }
                    else if (type === "" && element["addr:housenumber"]) {
                        type = "house"
                    }
                    else if (type === "") {
                        type = "unknown"
                    }
                    element.type = type
                }
                else if (element.typeOfShape === 'polygon') {
                    // turn osm_id to bigInit
                    let id = BigInt(element.osm_id)
                    forResult = await prisma.$queryRawUnsafe(`select 
                        landuse, building, amenity, leisure, shop,
                        st_y(st_transform(st_centroid(way),4326)) as lat, 
                        st_x(st_transform(st_centroid(way),4326)) as lng from planet_osm_polygon where osm_id = $1`, id)
                    // for type
                    let type = ""
                    if (forResult[0].building && forResult[0].building !== "yes") {
                        type = forResult[0].building
                    }
                    else if (forResult[0].amenity) {
                        type = forResult[0].amenity
                    }
                    else if (forResult[0].landuse) {
                        type = forResult[0].landuse
                    }
                    else if (forResult[0].leisure) {
                        type = forResult[0].leisure
                    }
                    else if (forResult[0].shop) {
                        type = forResult[0].shop
                    }
                    else if (type === "") {
                        type = "unknown"
                    }
                    element.type = type
                }
                element.lat = forResult[0].lat
                element.lng = forResult[0].lng
                let fullAddress = ''
                if (element["name"]) {
                    fullAddress += element["name"]
                }
                if (element["addr:housenumber"]) {
                    fullAddress += ' ' + element["addr:housenumber"]
                }
                if (element["addr:street"]) {
                    fullAddress += ' ' + element["addr:street"]
                }
                // add ward and district
                if (ward) {
                    fullAddress += ', ' + ward
                }
                if (district) {
                    fullAddress += ', ' + district
                }
                // add city
                fullAddress += ', ' + "Thành phố Hồ Chí Minh"
                element.fullAddress = fullAddress

                return {
                    osm_id: element.osm_id,
                    address: element.fullAddress,
                    type: element.type,
                    typeOfShape: element.typeOfShape,
                    lat: element.lat,
                    lng: element.lng,
                    totalDistance: element.totalDistance
                }
            }
            )
            // wait for all promises to resolve
            result = await Promise.all(result)
            res.status(200).json({
                state: "success",
                searchMode: "full",
                message: "Your request is successful",
                data: result
            })
            return
        }
        ///////////////////////////////////////////////// start searching street
        else if (searchMode === 'street') {
            // search for only street
            console.log(street)
            // check if street already include 'Đường'
            if (typeof street === 'string' && street.includes('Đường')) {
                // add at first
                street = 'Đường ' + street
            }
            // @ts-ignore
            let resForStreet = await findStreet(prisma, street)
            // connect all coors
            let coorsArray:any = []
            // we will intend to get the center of which have most coors
            let maxLength = -999
            let maxIndex = -999

            for (let i = 0; i < resForStreet.length; i++) {
                let geojson = JSON.parse(resForStreet[i].st_asgeojson)
                // geojson.coors is array of coors
                coorsArray = [...coorsArray, ...geojson.coordinates]
                // get the center of which have most coors
                if (geojson.coordinates.length > maxLength) {
                    maxLength = geojson.coordinates.length
                    maxIndex = i
                }
            }
            // return result
            if (resForStreet.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `Street ${street} is not exist`
                })
                return
            }
            else {
                resForStreet = {
                    state: "success",
                    searchMode: "street",
                    address: street + " " + ward + " " + district + " " + "Thành phố Hồ Chí Minh",
                    center: [resForStreet[maxIndex].st_x, resForStreet[maxIndex].st_y],
                    borderLine: coorsArray
                }
                res.status(200).json(resForStreet)
            }
        }
        ///////////////////////////////////////////////// start searching ward
        else if (searchMode === 'ward') {
            // search for only ward
            console.log(ward, district)
            // @ts-ignore
            let resForWard = await findWard(prisma, ward, district)
            if (resForWard.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `Ward ${ward} in district ${district} is not exist`
                })
                return
            }
            else {
                let geojson = JSON.parse(resForWard[0].st_asgeojson)
                resForWard = {
                    state: "success",
                    searchMode: "ward",
                    address: ward + " " + district + " " + "Thành phố Hồ Chí Minh",
                    center: [resForWard[0].st_x, resForWard[0].st_y],
                    borderLine: geojson.coordinates
                }
                res.status(200).json(resForWard)
            }
        }
        ///////////////////////////////////////////////// start searching district
        else if (searchMode === 'district') {
            // search for only district
            console.log(district)
            // @ts-ignore
            let resForDistrict = await findDistrict(prisma, district)
            if (resForDistrict.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `District ${district} is not exist`
                })
                return
            }
            else {
                let geojson = JSON.parse(resForDistrict[0].st_asgeojson)
                resForDistrict = {
                    state: "success",
                    searchMode: "district",
                    address: district + " " + "Thành phố Hồ Chí Minh",
                    center: [resForDistrict[0].st_x, resForDistrict[0].st_y],
                    borderLine: geojson.coordinates
                }
                res.status(200).json(resForDistrict)
            }

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