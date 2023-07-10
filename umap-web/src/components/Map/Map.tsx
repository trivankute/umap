"use client";
import React, { useRef, useState, useEffect } from "react";
import Event from "../MapTools/Event/Event";
import MainMarker from "../MapTools/MapInteraction/MainMarker/MainMarker";
import { MapContainer, ZoomControl, WMSTileLayer, LayersControl, useMapEvents } from "react-leaflet";
import './Map.css';
import PageLoading from "../ForLoading/PageLoading/PageLoading";
import MapFilter from "../MapTools/MapInteraction/MapFilter/MapFilter";

const { BaseLayer } = LayersControl;

interface MapViewProps {
  interactMode: 'mainMarkerOff' | 'mainMarkerOn'|'filter',
  setInteractMode: any,
  setShowContextMenu: any,
  setShowFilterMenu: any,
  setMainMarkerPosition:any,
  mainMarkerPosition:any,
  addressList:any,
  mapRef: any,
  fetchingFilter:any,
}

export default function MapView(props: MapViewProps) {
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
            <MainMarker mapRef={props.mapRef} interactMode={props.interactMode} 
            setInteractMode={props.setInteractMode} setPosition={props.setMainMarkerPosition}
            position={props.mainMarkerPosition} fetchingFilter={props.fetchingFilter}/>
            <Event setShowContextMenu={props.setShowContextMenu} setShowFilterMenu={props.setShowFilterMenu}/>
            {props.interactMode === 'filter' &&
              <MapFilter mapRef={props.mapRef} addressList={props.addressList} 
              fetchingFilter={props.fetchingFilter} mainMarker={props.mainMarkerPosition}/>
            }
          </MapContainer>
      }
    </>
  );
}