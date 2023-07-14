import { Circle } from "react-leaflet"
import {icon} from "./CustomMarker"
import InformationMarker from "../InformationMarker/InformationMarker"


interface CircleFilterProps{
    mapRef:any,
    addressList:any,
    fetchingFilter: any,
    mainMarker:any
}
export default function CircleFilter(props:CircleFilterProps){
    return (
        <>
        {props.fetchingFilter ?
            <Circle
            center={{ lat: props.mainMarker[0], lng: props.mainMarker[1] }}
            pathOptions={{ color: 'red' }}
            radius={props.fetchingFilter} />
            :
            props.addressList.map((address:any) =>
                <InformationMarker position={[address.lat,address.lng]}
                    text={address.address}
                    type={address.type}
                    mainMarkerPos={{ lat: props.mainMarker[0], lng: props.mainMarker[1] }}
                //icon={icon}
                />
            )
            
        }    
        </>
    )
}