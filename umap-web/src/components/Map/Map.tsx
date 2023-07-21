"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Event from "../MapTools/Event/Event";
import MainMarker from "../MapTools/MapInteraction/MainMarker/MainMarker";
import { MapContainer, ZoomControl, WMSTileLayer, LayersControl, useMapEvents, Polyline, Popup } from "react-leaflet";
import './Map.css';
import MarkerElement from "../MapTools/MapInteraction/MarkerElement/MarkerElement";
import PageLoading from "../ForLoading/PageLoading/PageLoading";
import { useAppSelector } from "@/redux/hooks";
const { BaseLayer } = LayersControl;
import DirectionPopup from '@/components/Map/DirectionPopup';
import RouteList from './RouteList'

const pathStyle = {
  normal: {
    color: 'green',
    opacity: 0.8,
    weight: 5
  },
  hover: {
    color: 'yellow',
    weight: 5
  }
}


interface MapViewProps {
  interactMode: 'mainMarkerOff' | 'mainMarkerOn'|'filter',
  setInteractMode: any,
  setMainMarkerPosition:any,
  mainMarkerPosition:any,
  addressList:any,
  mapRef: any,
  fetchingFilter:any,
}

export default function MapView(props:MapViewProps) {
  const item = useAppSelector(state => state.search.address)
  const select = useAppSelector(state => state.search.select)
  const source = useAppSelector(state => state.routing.source)
  const destination = useAppSelector(state => state.routing.destination)
  // const directionsInfor = useAppSelector(state => state.routing.directionInfor)
  // const direction = directionsInfor ? directionsInfor.map(
  //   (item: any)=> {
  //     const invertLatLng = ([lng, lat]: [number, number]) => [lat, lng]
  //     const pathPositions = [item.coors.map((position: any)=> invertLatLng(position))]
  //     return <Polyline key={item.osm_id} pathOptions={item.hovered ? pathStyle.hover : pathStyle.normal} positions={pathPositions} />
  //   }
  // ):null

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

  // useEffect(()=>{
  //   console.log('direction changed')
  //   setDirectionLine(direction)
  // },[directionsInfor])

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
                <WMSTileLayer url="https://umap.dientoan.vn/geoserver/ows?" layers='umap:hochiminh-basemap' />
              </BaseLayer>
              <BaseLayer checked name="OSM">
                <WMSTileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
              </BaseLayer>
            </LayersControl>

            <ZoomControl position="topright" />
            <MainMarker
            mapRef={props.mapRef} interactMode={props.interactMode} 
            setInteractMode={props.setInteractMode} setPosition={props.setMainMarkerPosition}
            position={props.mainMarkerPosition} fetchingFilter={props.fetchingFilter} addressList={props.addressList}/>
            {select && item && <MarkerElement mapRef={mapRef} item={item} type="select"/>}
            {source && source!=="readyToSet" && <MarkerElement mapRef={mapRef} item={source} type="source"/>}
            {destination && destination!=="readyToSet" && <MarkerElement mapRef={mapRef} item={destination} type="destination"/>}
            {/* {direction && <Polyline pathOptions={redOptions} positions={direction} />} */}
            {/* {direction} */}
            <RouteList />
            <DirectionPopup />
            <Event/>
          </MapContainer>
      }
    </>
  );
}