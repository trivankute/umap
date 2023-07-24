interface pointOrPolygonOrRoadTypeBox {
    // same
    amenity?: string,
    shop?: string,
    highway?: string,

    // point
    tourism?: string,
    historic?: string,
    // must have
    "addr:housenumber"?: string,

    // polygon
    landuse?:string,
    building?:string,
    leisure?: string,

    // road
    road_highway?: string,
}

export default function findType(signal:'point'|'polygon'|'road', typeBox:pointOrPolygonOrRoadTypeBox) {
    let type = ""
    if(signal === 'polygon')
    {
        if (typeBox.building && typeBox.building !== "yes") {
            type = typeBox.building
        }
        else if (typeBox.amenity) {
            type = typeBox.amenity
        }
        else if (typeBox.landuse) {
            type = typeBox.landuse
        }
        else if (typeBox.leisure) {
            type = typeBox.leisure
        }
        else if (typeBox.shop) {
            type = typeBox.shop
        }
        else if (typeBox.highway) {
            type = typeBox.highway
        }
        else if (type === "") {
            type = "unknown"
        }
    }
    else if(signal === 'point')
    {
        if (typeBox.amenity) {
            type = typeBox.amenity
        }
        else if (typeBox.shop) {
            type = typeBox.shop
        }
        else if (typeBox.tourism) {
            type = typeBox.tourism
        }
        else if (typeBox.historic) {
            type = typeBox.historic
        }
        else if (typeBox.highway) {
            type = typeBox.highway
        }
        else if (type === "" && typeBox["addr:housenumber"]) {
            type = "house"
        }
        else if (type === "") {
            type = "unknown"
        }
    }
    else if(signal === 'road')
    {
        if (typeBox.road_highway) {
            type = typeBox.road_highway
        }
        else {
            type = "unknown"
        }
    }
    return type
}