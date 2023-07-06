"use client";
import React ,{ useEffect, useRef, useState} from "react";
import Event from "../MapTools/Event/Event";
import LocationMarkers from "../MapTools/LocationMarker/LocationMarker";
import { MapContainer,ZoomControl,WMSTileLayer, LayersControl} from "react-leaflet";
import './Map.css';

const { BaseLayer} = LayersControl;
export default function MapView(){
    const mapRef=useRef<any>(null)
    const [center, setCenter] = useState({lat:10.879961,lng:106.810877});
    const [zoom, setZoom] = useState(12);

    useEffect(()=>{
      const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/session/", {method: 'GET'})
      .then(response=>response.json())
      .then(result=>result)
      console.log("response",response)
      if(response.zoom===null){
        console.log('null')
      }else{
        setZoom(response.zoom)
        setCenter(response.center)
        mapRef.current.flyTo([response.center.lat,response.center.lng], response.zoom)
      }
    }
      fetchData()
    }, [])
    
    return (
        <>
        <MapContainer
        // @ts-ignore
          center ={center}
          zoom={zoom}
          scrollWheelZoom={true}
          zoomControl = {false} 
          style={{height:"100vh",width:"100vw"}}
          ref={mapRef}
        >

      <LayersControl>
        <BaseLayer checked name="U-MAP">
          <WMSTileLayer url="https://umap.dientoan.vn/geoserver/ows?" layers='TVtesting:planet_osm_line'/>
        </BaseLayer>
        <BaseLayer checked name="OSM">
          <WMSTileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
        </BaseLayer>
      </LayersControl>

        <ZoomControl position="topright" />
        <LocationMarkers/>
        <Event />
        </MapContainer>
        </>
      );
}