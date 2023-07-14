"use client";
import React, { useRef, useState, useEffect } from "react";
import Event from "../MapTools/Event/Event";
import MainMarker from "../MapTools/MapInteraction/MainMarker/MainMarker";
import { MapContainer,ZoomControl,WMSTileLayer, LayersControl, Polyline} from "react-leaflet";
import './Map.css';
import MarkerElement from "../MapTools/MapInteraction/MarkerElement/MarkerElement";
import PageLoading from "../ForLoading/PageLoading/PageLoading";
import { useAppSelector } from "@/redux/hooks";

const { BaseLayer } = LayersControl;
const redOptions = { 
  color: 'green' 
}
export default function MapView() {
  const item = useAppSelector(state => state.search.address)
  const select = useAppSelector(state => state.search.select)
  const source = useAppSelector(state => state.routing.source)
  const destination = useAppSelector(state => state.routing.destination)
  const direction = useAppSelector(state => state.routing.direction)
  
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
        {select && item && <MarkerElement mapRef={mapRef} item={item}/>}

        {source && <MarkerElement mapRef={mapRef} item={source}/>}
        {destination && <MarkerElement mapRef={mapRef} item={destination}/>}

        {direction && <Polyline pathOptions={redOptions} positions={direction} />}
        <Event />
        </MapContainer>
      }
    </>
  );
}