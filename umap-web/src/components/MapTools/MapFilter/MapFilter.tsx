import { marker } from "leaflet";
import { Marker } from "react-leaflet"

interface MapFilterProps{
    mafRef:any,
    addressList:any
}
export default function MapFilter({addressList}:MapFilterProps){
    if(addressList.length > 0){
        console.log(addressList);
        let markerList = addressList.map((address:any) =>
                <Marker position={[address.lat,address.lng]}/>
        )
        return markerList;
    }
    else 
        return <></>
}