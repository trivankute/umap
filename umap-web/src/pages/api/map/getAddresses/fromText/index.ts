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
import findHousename from "@/pages/api/utils/findHousename";
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
        console.log(text)
        let resultOfParser = await addressParser(text)
        console.log(resultOfParser)
        let {
            housenumber, housename, street, ward, district, city
        } = resultOfParser
        console.log(housename, housenumber, street, ward, district, city)
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
        if (typeof city === 'boolean') {
            city = false
        }

        let searchMode = ''
        if (housename && housenumber) {
            if (street && ward && district && city) {
                searchMode = 'full'
            }
            else if (!street || !district || !ward || !city) {
                searchMode = 'housename'
                // there would be more features on full mode even lack of ward or district or street or city
                // .....
            }
        }
        if (housename) {
            searchMode = 'housename'
        }
        else if (!housenumber && !housename && street) {
            searchMode = 'street'
        }
        else if (!street && ward) {
            searchMode = 'ward'
        }
        else if (!ward && district) {
            searchMode = 'district'
        }
        else if (!district && city) {
            searchMode = 'city'
        }
        // if searchMode is empty
        if (searchMode === '') {
            res.status(400).json({
                state: "failed",
                message: "Can't regconize your address"
            })
            return
        }
        ///////////////////////////////////////////////// start searching housename
        if (searchMode === 'housename') {
            // search for only housename
            console.log(housename, street, ward, district, city)
            // @ts-ignore
            let resForHousenameArray = await findHousename(prisma, housename, street, ward, district, city)
            // return result
            if (resForHousenameArray!.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `${housename} is not exist`
                })
                return
            }
            else {
                res.status(200).json({
                    state: "success",
                    searchMode: "full",
                    message: "Your request is successful",
                    data: resForHousenameArray
                })
            }
        }
        ///////////////////////////////////////////////// start searching full
        else if (searchMode === 'full') {
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
            console.log("city = " + city)
            console.log("address = " + address)
            console.log("location_name = " + location_name)

            ////////////////////// check if district contain ward or not
            // @ts-ignore
            let resultCheckWard = await findWard(prisma, ward, district, city)
            if (resultCheckWard.length === 0) {
                await prisma.$disconnect()
                res.status(400).json({
                    state: "failed",
                    message: `Ward ${ward} with district ${district} and city ${city} is not exist`
                })
                return
            }
            // prisma call
            ////////////////////////////////// old version
            let points = await prisma.$queryRawUnsafe(`
            select osm_id::text, "addr:housenumber", "addr:street", name from planet_osm_point
            where place isnull and admin_level isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) 
            and st_contains(st_setsrid($1::geometry, 3857), way)
                `, resultCheckWard[0].ward_way)
            await prisma.$disconnect()
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
            let polygons = await prisma.$queryRawUnsafe(`
            select osm_id::text, "addr:housenumber", "addr:street", name from planet_osm_polygon
            where place isnull and admin_level isnull and (name notnull or "addr:street" notnull or "addr:housenumber" notnull) 
            and st_contains(st_setsrid($1::geometry, 3857), way)
                `, district, ward)
            await prisma.$disconnect()
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
            if (result.length === 0) {
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
                        amenity, shop, tourism, historic, highway,
                        st_y(st_transform(way,4326)) as lat, 
                        st_x(st_transform(way,4326)) as lng from planet_osm_point where osm_id = $1`, id)
                    await prisma.$disconnect()
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
                    else if (forResult[0].highway) {
                        type = forResult[0].highway
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
                        landuse, building, amenity, leisure, shop, highway,
                        st_y(st_transform(st_centroid(way),4326)) as lat, 
                        st_x(st_transform(st_centroid(way),4326)) as lng from planet_osm_polygon where osm_id = $1`, id)
                    await prisma.$disconnect()
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
                    else if (forResult[0].highway) {
                        type = forResult[0].highway
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
                fullAddress += ', ' + city + '.'
                element.fullAddress = fullAddress

                return {
                    osm_id: element.osm_id,
                    address: element.fullAddress,
                    type: element.type,
                    typeOfShape: element.typeOfShape,
                    center: [element.lat, element.lng],
                    totalDistance: element.totalDistance
                }
            }
            )
            // wait for all promises to resolve
            result = await Promise.all(result)
            await prisma.$disconnect()
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
            // @ts-ignore
            let resForStreetArray = await findStreet(prisma, street, ward, district, city)
            // return result
            if (resForStreetArray.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `Street ${street} is not exist`
                })
                return
            }
            else {
                resForStreetArray = resForStreetArray.map((item: any) => {
                    let geojson = JSON.parse(item.st_asgeojson)
                    geojson.coordinates = geojson.coordinates.map((item: any) => {
                        return [item[1], item[0]]
                    })
                    return {
                        state: "success",
                        searchMode: "street",
                        address: street + " " + item.ward + " " + item.district + " " + item.city,
                        center: [item.st_y, item.st_x],
                        borderLine: geojson.coordinates
                    }
                })
                res.status(200).json(resForStreetArray)
                return
            }
        }
        ///////////////////////////////////////////////// start searching ward
        else if (searchMode === 'ward') {
            // search for only ward
            console.log(ward, district)
            // @ts-ignore
            let resForWard = await findWard(prisma, ward, district, city)
            await prisma.$disconnect()
            if (resForWard.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `Ward ${ward} in district ${district} is not exist`
                })
                return
            }
            else {
                resForWard = resForWard.map((item: any) => {
                    let geojson = JSON.parse(item.st_asgeojson)
                    geojson.coordinates = geojson.coordinates.map((item: any) => {
                        return [item[1], item[0]]
                    })
                    return {
                        state: "success",
                        searchMode: "ward",
                        address: item.ward + " " + item.district + " " + item.city,
                        center: [item.st_y, item.st_x],
                        borderLine: geojson.coordinates
                    }
                })
                res.status(200).json(resForWard)
                return
            }
        }
        ///////////////////////////////////////////////// start searching district
        else if (searchMode === 'district') {
            // search for only district
            console.log(district)
            // @ts-ignore
            let resForDistrict = await findDistrict(prisma, district, city)
            await prisma.$disconnect()
            if (resForDistrict.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `District ${district} is not exist`
                })
                return
            }
            else {
                resForDistrict = resForDistrict.map((item: any) => {
                    let geojson = JSON.parse(item.st_asgeojson)
                    geojson.coordinates = geojson.coordinates.map((item: any) => {
                        return [item[1], item[0]]
                    })
                    return {
                        state: "success",
                        searchMode: "district",
                        address: item.district + " " + item.city,
                        center: [item.st_y, item.st_x],
                        borderLine: geojson.coordinates
                    }
                })
                res.status(200).json(resForDistrict)
                return
            }
        }
        ///////////////////////////////////////////////// start searching city
        else if (searchMode === 'city') {
            // search for only city
            console.log(city)
            // @ts-ignore
            let resForCity = await findCity(prisma, city)
            await prisma.$disconnect()
            if (resForCity.length === 0) {
                res.status(400).json({
                    state: "failed",
                    message: `City ${city} is not exist`
                })
                return
            }
            else {
                resForCity = resForCity.map((item: any) => {
                    let geojson = JSON.parse(item.st_asgeojson)
                    geojson.coordinates = geojson.coordinates.map((item: any) => {
                        return [item[1], item[0]]
                    })
                    return {
                        state: "success",
                        searchMode: "city",
                        address: item.city,
                        center: [item.st_y, item.st_x],
                        borderLine: geojson.coordinates
                    }
                })
                res.status(200).json(resForCity)
                return
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