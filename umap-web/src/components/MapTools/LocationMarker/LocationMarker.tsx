'use client'
import { useState } from "react";
import { useMapEvents, Marker, Popup} from "react-leaflet";
import { PopupInfor } from "@/types/Types";
import useSWR from "swr"
import { LatLng } from "leaflet";

function PopUpData({data}:{data:PopupInfor}){
  return (
    <>
      <p>Địa chỉ: {data.address}</p>
      <p>Vĩ độ: {data.lat} <br/>Kinh độ: {data.lng}</p>
    </>
  )
}

function SetPopup({latlng}:{latlng:LatLng}){

  const fetcher = (...args:[any]) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading }
              = useSWR(`/api/map/getAddress/fromCoor?lat=${latlng.lat}&lng=${latlng.lng}`, fetcher)

  // render data
  return (
    <Popup>
      {error && "There is some error"}
      {isLoading && "Loading..."}
      {data && <PopUpData data={data.data}/>}
    </Popup>
  );
}

export default function LocationMarkers() {
    const [markers, setMarkers] = useState([]);
    useMapEvents({
      click(e) {
          // @ts-ignore
          setMarkers(markers => markers.concat([e.latlng]));
      }
    });
  
    const removeMarker = (index: any) => {
      const newMarkers = markers.filter((_, i) => i !== index);
      setMarkers(newMarkers);
    };
  
  
    return (
      <>
        {markers.map((marker,idx) => 
        <Marker 
          key = {idx} 
          position={marker} 
          eventHandlers={
            {
              dblclick(){
                removeMarker(idx);
              }
            }
          }
        >  
          <SetPopup latlng={marker}/>
        </Marker>
        
        )}
      </>
    );
  }