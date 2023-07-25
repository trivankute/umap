import findType from "./findType";

const nearestStreetFromKnownPoint = require('./nearestStreetFromKnownPoint');

export default async function findHousename(prisma: any, housename: string, street:string|false, ward: string|false, district: string|false, city: string|false) {
    if(housename && !street && !district && !ward && !city) {
        let name = housename
        let points = await prisma.$queryRawUnsafe(`
        select osm_id::text, "addr:housenumber" as housenumber, "addr:street" as street, name, way::text, levenshtein(lower(name), lower($1)) as distance
        , amenity, shop, tourism, historic, highway,
        st_y(st_transform(way,4326)) as lat, 
        st_x(st_transform(way,4326)) as lng  from planet_osm_point
    where boundary isnull and admin_level isnull and place isnull and name notnull and levenshtein(lower(name), lower($1)) < 5
    order by levenshtein(lower(name), lower($1))
    limit 10
        `, name)
        await prisma.$disconnect()
        // find street for each result
        for (let i = 0; i < points.length; i++) {
            let res = await nearestStreetFromKnownPoint(prisma, points[i].osm_id, 'point');
            points[i].address = points[i].name
            if(points[i].housenumber)
                points[i].address += ', ' + points[i].housenumber
            if(points[i].street)
                points[i].address += ', ' + points[i].street
            else
                points[i].address += ', ' + res[0].name
            points[i].address += ', ' + res[0].ward + ', ' + res[0].district + ', ' + res[0].city
            points[i].type = findType('point', points[i])
        }
        let polygons = await prisma.$queryRawUnsafe(`
        select osm_id::text, "addr:housenumber" as housenumber, "addr:street" as street, name, way::text, levenshtein(lower(name), lower($1)) as distance
        , landuse, building, amenity, leisure, shop, highway,
        st_y(st_transform(st_centroid(way),4326)) as lat, 
        st_x(st_transform(st_centroid(way),4326)) as lng from planet_osm_polygon
    where boundary isnull and admin_level isnull and place isnull and name notnull and levenshtein(lower(name), lower($1)) < 5
    order by levenshtein(lower(name), lower($1))
    limit 10
        `, name)
        await prisma.$disconnect()
        // find street for each result
        for (let i = 0; i < polygons.length; i++) {
            let res = await nearestStreetFromKnownPoint(prisma, polygons[i].osm_id, 'polygon');
            polygons[i].address = polygons[i].name
            if(polygons[i].housenumber)
                polygons[i].address = polygons[i].address + ', ' + polygons[i].housenumber
            if(polygons[i].street)
                polygons[i].address = polygons[i].address + ', ' + polygons[i].street
            else
                polygons[i].address = polygons[i].address + ', ' + res[0].name
            polygons[i].address = polygons[i].address + ', ' + res[0].ward + ', ' + res[0].district + ', ' + res[0].city
            polygons[i].type = findType('polygon', polygons[i])
        }
    
        let result = [...points, ...polygons]
        // sort result by distance
        result.sort((a, b) => {
            return a.distance - b.distance
        })
    
        // define result again before response
        result = result.map(element => {
            return {
                address: element.address,
                type: element.type,
                center: [element.lat, element.lng],
            }
        })
    
        return result
        
    }
}