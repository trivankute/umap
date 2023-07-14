"use client";
import React, { useState, useEffect } from "react";
import Event from "../MapTools/Event/Event";
import MainMarker from "../MapTools/MapInteraction/MainMarker/MainMarker";
import { MapContainer, ZoomControl, WMSTileLayer, LayersControl, useMapEvents } from "react-leaflet";
import './Map.css';
import MarkerElement from "../MapTools/MapInteraction/MarkerElement/MarkerElement";
import PageLoading from "../ForLoading/PageLoading/PageLoading";
import StartPoint from "../MapTools/Routing/StartPoint/StartPoint";
import EndPoint from "../MapTools/Routing/EndPoint/EndPoint";
import { useAppSelector } from "@/redux/hooks";
const { BaseLayer } = LayersControl;

interface MapViewProps {
  interactMode: 'mainMarkerOff' | 'mainMarkerOn'|'filter',
  setInteractMode: any,
  setMainMarkerPosition:any,
  mainMarkerPosition:any,
  addressList:any,
  mapRef: any,
  fetchingFilter:any,

  startPoint:any,
  setStartPoint:any,
  endPoint:any,
  setEndPoint:any
}

export default function MapView() {
  const item = useAppSelector(state => state.search.address)
  const select = useAppSelector(state => state.search.select)
  const source = useAppSelector(state => state.routing.source)
  const destination = useAppSelector(state => state.routing.destination)
  
  const mapRef = useRef<any>(null)
  const [view, setView] = useState<any>(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/session/", { method: 'GET' })
        .then(response => response.json())
        .then(result => result)
      if (response.zoom === null || response.center === null) {
        setView({
          center: { lat: 10.879961, lng: 106.810877 },
          zoom: 12
        })
      } else {
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
        !view ?
          <PageLoading />
          :
          <MapContainer
            // @ts-ignore
            center={view.center}
            // @ts-ignore
            zoom={view.zoom}
            scrollWheelZoom={true}
            zoomControl={false}
            style={{ height: "100vh", width: "100vw" }}
            ref={props.mapRef}
          >

            <LayersControl>
              <BaseLayer checked name="U-MAP">
                <WMSTileLayer url="https://umap.dientoan.vn/geoserver/ows?" layers='TVtesting:planet_osm_line' />
              </BaseLayer>
              <BaseLayer checked name="OSM">
                <WMSTileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
              </BaseLayer>
            </LayersControl>

            <ZoomControl position="topright" />
            <MainMarker startPoint={props.startPoint} endPoint={props.endPoint}
            setStartPoint={props.setStartPoint} setEndPoint={props.setEndPoint}
            mapRef={props.mapRef} interactMode={props.interactMode} 
            setInteractMode={props.setInteractMode} setPosition={props.setMainMarkerPosition}
            position={props.mainMarkerPosition} fetchingFilter={props.fetchingFilter} addressList={props.addressList}/>
            {
              props.startPoint && Array.isArray(props.startPoint) &&
              <StartPoint position={props.startPoint} setPosition={props.setStartPoint}/>
            }
            {
              props.endPoint && Array.isArray(props.endPoint) &&
              <EndPoint position={props.endPoint} setPosition={props.setEndPoint}/>
            }
            {select && item && <MarkerElement mapRef={mapRef} item={item}/>}
            {source && <MarkerElement mapRef={mapRef} item={source}/>}
            {destination && <MarkerElement mapRef={mapRef} item={destination}/>}
            <Event/>
          </MapContainer>
      }
    </>
  );
}