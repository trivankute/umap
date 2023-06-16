"use client";
import React ,{ useState} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./map.css";
export default function ViewMap(){
    const [center, setCenter] = useState({lat:10.879961,lng:106.810877});
    const ZOOM_LEVEL = 9;
    return (
        <>
        <MapContainer
          center ={center}
          zoom={ZOOM_LEVEL}
          scrollWheelZoom={true} 
          style={{height:"100vh",width:"100vw"}}
        >
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        </>
      );
}