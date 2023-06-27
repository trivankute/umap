import nearestStreetFromKnownPoint from "./nearestStreetFromKnownPoint"

export default async function handler(prisma: any, lng: string, lat: string) {
    // ko add specific road thi no nhanh hon nx?
    // specific_road as (select * from planet_osm_line, wards
    // where boundary isnull and name notnull and st_contains(wards.ward_geometry, way)),
    const a: any = await prisma.$queryRawUnsafe(`
    with 
point as (select $1::geometry),
point_point as (select osm_id, "addr:housenumber","addr:street",name,way, amenity, shop, tourism, historic from planet_osm_point,point
where boundary isnull and ("addr:housenumber" notnull or name notnull or "addr:street" notnull)
order by st_transform(way,4326) <-> point.geometry
limit 1),
point_polygon as (select osm_id, "addr:housenumber","addr:street",name,way, landuse, building, amenity, leisure, shop from planet_osm_polygon,point
where boundary isnull and ("addr:housenumber" notnull or name notnull or "addr:street" notnull)
order by st_closestPoint(st_transform(way,4326), point.geometry) <-> point.geometry
limit 1),
wards as (select ward,ward_geometry from wards_forsearch,point
where st_contains(st_transform(ward_geometry,4326), point.geometry)
limit 1),
districts as (select district from districts_forsearch,point
where st_contains(st_transform(district_geometry,4326), point.geometry)
limit 1),
roads as (select name, way, highway from planet_osm_line, point
where boundary isnull and name notnull
order by st_closestPoint(st_transform(way,4326), point.geometry) <-> point.geometry
limit 1)

select 
point_point.osm_id as point_osm_id,
point_point."addr:housenumber" as point_housenumber,
point_point."addr:street" as point_street,
point_point.name as point_location_name,
point_point.amenity as point_amenity,
point_point.shop as point_shop,
point_point.tourism as point_tourism,
point_point.historic as point_historic,
point_polygon.osm_id as polygon_osm_id,
point_polygon."addr:housenumber" as polygon_housenumber,
point_polygon."addr:street" as polygon_street,
point_polygon.name as polygon_location_name,
point_polygon.building as polygon_building,
point_polygon.landuse as polygon_landuse,   
point_polygon.amenity as polygon_amenity,
point_polygon.leisure as polygon_leisure,
point_polygon.shop as polygon_shop,
roads.name as road_name,
roads.highway as road_highway,
wards.ward, districts.district, 
st_x(st_transform(st_centroid(point_point.way),4326)) as point_lng,
st_y(st_transform(st_centroid(point_point.way),4326)) as point_lat, 
st_x(st_transform(st_centroid(point_polygon.way),4326)) as polygon_lng,
st_y(st_transform(st_centroid(point_polygon.way),4326)) as polygon_lat,
st_x(st_transform(st_centroid(roads.way),4326)) as road_lng,
st_y(st_transform(st_centroid(roads.way),4326)) as road_lat,
st_distance (point.geometry,st_transform(st_centroid(point_polygon.way),4326)) as toPolygon,
st_distance (point.geometry,st_transform(st_centroid(point_point.way),4326)) as toPoint,
st_distance (point.geometry,st_transform(st_centroid(roads.way),4326)) as toRoad


from point, point_point, point_polygon, roads, wards, districts
    `, "SRID=4326;POINT(" + lng + " " + lat + ")")
    const {
        point_osm_id,
        point_housenumber,
        point_street,
        point_location_name,
        point_amenity,
        point_shop,
        point_tourism,
        point_historic,

        polygon_osm_id,
        polygon_housenumber,
        polygon_street,
        polygon_location_name,
        polygon_building,
        polygon_landuse,
        polygon_amenity,
        polygon_leisure,
        polygon_shop,

        road_name,
        road_highway,

        ward,
        district,

        point_lng,
        point_lat,
        polygon_lng,
        polygon_lat,
        road_lng,
        road_lat,
        topolygon,
        topoint,
        toroad
    } = a[0]
    // find the smallest distance to point, polygon, road
    let smallestDistance = Math.min(topolygon, topoint, toroad)
    // if smallestDistance is toPolygon, return point_polygon
    if (smallestDistance === topolygon) {
        let address = ""
        let typeOfShape = "polygon"
        if (polygon_location_name) {
            address += polygon_location_name + ", "
        }
        if (polygon_housenumber) {
            address += polygon_housenumber + " "
        }
        if (polygon_street) {
            address += polygon_street + ", "
        }
        else {
            // find new nearest street if polygon_street is null
            let nearestStreet = await nearestStreetFromKnownPoint(prisma, polygon_osm_id, 'polygon');
            address += nearestStreet[0].name + ", "
        }
        if (ward) {
            address += ward + ", "
        }
        if (district) {
            address += district + ", "
        }
        // default city is Ho Chi Minh
        address += "Thành phố Hồ Chí Minh."

        // for type
        let type = ""
        if (polygon_building && polygon_building !== "yes") {
            type = polygon_building
        }
        if (polygon_amenity) {
            type = polygon_amenity
        }
        if (polygon_landuse) {
            type = polygon_landuse
        }
        if (polygon_leisure) {
            type = polygon_leisure
        }
        if (polygon_shop) {
            type = polygon_shop
        }
        if (type === "") {
            type = "unknown"
        }

        return ({
            address,
            lng: polygon_lng,
            lat: polygon_lat,
            type,
            typeOfShape
        })
    }
    // if smallestDistance is toPoint, return point_point
    else if (smallestDistance === topoint) {
        let address = ""
        let typeOfShape = "point"
        if (point_location_name) {
            address += point_location_name + ", "
        }
        if (point_housenumber) {
            address += point_housenumber + " "
        }
        if (point_street) {
            address += point_street + ", "
        }
        else {
            // find new nearest street if point_street is null
            let nearestStreet = await nearestStreetFromKnownPoint(prisma, point_osm_id, 'point');
            address += nearestStreet[0].name + ", "
        }
        if (ward) {
            address += ward + ", "
        }
        if (district) {
            address += district + ", "
        }
        // default city is Ho Chi Minh
        address += "Thành phố Hồ Chí Minh."

        // for type
        let type = ""
        if (point_amenity) {
            type = point_amenity
        }
        if (point_shop) {
            type = point_shop
        }
        if (point_tourism) {
            type = point_tourism
        }
        if (point_historic) {
            type = point_historic
        }
        if (type === "" && point_housenumber) {
            type = "house"
        }
        if (type === "") {
            type = "unknown"
        }

        return ({
            address,
            lng: point_lng,
            lat: point_lat,
            type,
            typeOfShape
        })
    }

    // if smallestDistance is toRoad, return roads
    else {
        let address = ""
        let typeOfShape = "line"
        address += road_name + ", "
        if (ward) {
            address += ward + ", "
        }
        if (district) {
            address += district + ", "
        }
        // default city is Ho Chi Minh
        address += "Thành phố Hồ Chí Minh."

        // for type
        let type = ""
        if (road_highway) {
            type = road_highway
        }
        else {
            type = "unknown"
        }
        return ({
            address,
            lng: road_lng,
            lat: road_lat,
            type,
            typeOfShape
        })
    }
}