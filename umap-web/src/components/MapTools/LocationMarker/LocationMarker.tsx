'use client'
import { useState } from "react";
import { useMapEvents, Marker } from "react-leaflet";

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
              click(){
                removeMarker(idx);
              }
            }
          }
        />)}
      </>
    );
  }