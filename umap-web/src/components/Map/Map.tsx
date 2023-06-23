"use client";
import React, { useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl, useMapEvents, Popup, useMap } from "react-leaflet";
import { WMSTileLayer, LayersControl } from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;
import './Map.css';


function LocationMarkers() {
  const [markers, setMarkers] = useState([]);
  const map = useMapEvents({
    click(e) {
      // @ts-ignore
      setMarkers(markers => markers.concat([e.latlng]));
      console.log(markers);
    }
  });

  // @ts-ignore
  const removeMarker = (index) => {
    const newMarkers = markers.filter((_, i) => i !== index);
    setMarkers(newMarkers);
  };


  return (
    <>
      {markers.map((marker, idx) =>
        <Marker
          key={idx}
          position={marker}
          eventHandlers={
            {
              click() {
                removeMarker(idx);
              }
            }
          }
        />)}
    </>
  );
}

export default function MapView() {
  const [center, setCenter] = useState({ lat: 10.879961, lng: 106.810877 });
  const ZOOM_LEVEL = 12;
  return (
    <>
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100vh", width: "100vw" }}
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
        <LocationMarkers />
      </MapContainer>
    </>
  );
}