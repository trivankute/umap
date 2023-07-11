"use client";
import React, { useRef, useState, useEffect } from "react";
import Event from "../MapTools/Event/Event";
import MainMarker from "../MapTools/MapInteraction/MainMarker/MainMarker";
import { MapContainer,ZoomControl,WMSTileLayer, LayersControl} from "react-leaflet";
import './Map.css';
import { motion } from "framer-motion";
import MarkerElement from "../MapTools/MapInteraction/MarkerElement/MarkerElement";
import PageLoading from "../ForLoading/PageLoading/PageLoading";
import { SearchResult } from "@/types/Types";

const { BaseLayer } = LayersControl;
export default function MapView({itemMarker}:{itemMarker: SearchResult}) {
  const mapRef = useRef<any>(null)
  const [view, setView] = useState<any>(false)

  useEffect(()=>{
    const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/session/", {method: 'GET'})
    .then(response=>response.json())
    .then(result=>result)
    console.log(response)
    if(response.zoom===null||response.center===null){
      setView({
        center: {lat:10.879961,lng:106.810877},
        zoom: 12
      })
    }else{
      setView({
        center: response.center,
        zoom: response.zoom
      })
    }
  }
    fetchData()
  }, [])

  return (
    <>
      {
        !view?
          <PageLoading/>
        :
        <MapContainer
          // @ts-ignore
          center={view.center}
          // @ts-ignore
          zoom={view.zoom}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100vh", width: "100vw" }}
          ref={mapRef}
        >

          <LayersControl>
            <BaseLayer checked name="U-MAP">
              <WMSTileLayer url="https://umap.dientoan.vn/geoserver/ows?" layers='umap:hochiminh-basemap' />
            </BaseLayer>
            <BaseLayer checked name="OSM">
              <WMSTileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
            </BaseLayer>
          </LayersControl>

        <ZoomControl position="topright" />
        {/* marker for  */}
        <MainMarker mapRef={mapRef}/>
        {itemMarker && <MarkerElement mapRef={mapRef} item={itemMarker}/>}
        <Event />
        </MapContainer>
      }
    </>
  );
}