import { memo } from "react";
import { Marker } from "react-leaflet";

function StartPoint({position}:{position:any}) {
    return ( <>
        <Marker position={position}></Marker>
    </> );
}

export default memo(StartPoint);