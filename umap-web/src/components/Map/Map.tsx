"use client";
import React ,{ useState} from "react";
import { MapContainer, TileLayer , ZoomControl} from "react-leaflet";
import './Map.css';
export default function ViewMap(){
    const [center, setCenter] = useState({lat:10.879961,lng:106.810877});
    const ZOOM_LEVEL = 9;
    return (
        <>
        <MapContainer
        // @ts-ignore
          center ={center}
          zoom={ZOOM_LEVEL}
          scrollWheelZoom={true}
          zoomControl = {false} 
          style={{height:"100vh",width:"100vw"}}
        >
        <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        <ZoomControl position="topright" />
        </MapContainer>
        </>
      );
}