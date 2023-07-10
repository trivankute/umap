import { Marker, Circle } from "react-leaflet"
import {icon} from "./CustomMarker"


interface MapFilterProps{
    mapRef:any,
    addressList:any,
    fetchingFilter: any,
    mainMarker:any,
}
export default function MapFilter(props:MapFilterProps){
    return (
        <>
        {props.fetchingFilter ?
            <Circle
            center={{ lat: props.mainMarker[0], lng: props.mainMarker[1] }}
            pathOptions={{ color: 'red' }}
            radius={100} />
            :
            props.addressList.map((address:any) =>
                <Marker position={[address.lat,address.lng]}
                //icon={icon}
                />
            )
            
        }    
        </>
    )
}