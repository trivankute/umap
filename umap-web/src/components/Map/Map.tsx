"use client";
import React, { useRef, useState } from "react";
import Event from "../MapTools/Event/Event";
import LocationMarkers from "../MapTools/LocationMarker/LocationMarker";
import { MapContainer, ZoomControl, WMSTileLayer, LayersControl } from "react-leaflet";
import './Map.css';
import useSWR from 'swr'
import PageLoading from "../ForLoading/PageLoading/PageLoading";

const { BaseLayer } = LayersControl;
export default function MapView() {
  const mapRef = useRef<any>(null)
  // use swr
  const fetcher = (url: string) => fetch(url, { method: 'GET' })
    .then((res) => res.json())
    .then(result => result)
  const { data, error, isLoading } = useSWR('http://localhost:3000/api/session/', fetcher)
  const center = data?.center
  const zoom = data?.zoom
  console.log(data, isLoading)

  return (
    <>
      {
        // isLoading?
          <PageLoading/>
        // :
        // // data&&
        // // <MapContainer
        // //   // @ts-ignore
        // //   center={center}
        // //   // @ts-ignore
        // //   zoom={zoom}
        // //   scrollWheelZoom={true}
        // //   zoomControl={false}
        // //   style={{ height: "100vh", width: "100vw" }}
        // //   ref={mapRef}
        // // >

        // //   <LayersControl>
        // //     <BaseLayer checked name="U-MAP">
        // //       <WMSTileLayer url="https://umap.dientoan.vn/geoserver/ows?" layers='TVtesting:planet_osm_line' />
        // //     </BaseLayer>
        // //     <BaseLayer checked name="OSM">
        // //       <WMSTileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
        // //     </BaseLayer>
        // //   </LayersControl>

        // //   <ZoomControl position="topright" />
        // //   <LocationMarkers />
        // //   <Event />
        // // </MapContainer>
      }
    </>
  );
}