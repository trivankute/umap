"use client";
import React ,{ useEffect, useRef, useState} from "react";
import L, { popup } from "leaflet";
import { MapContainer, Marker, TileLayer , ZoomControl, useMapEvents,Popup,useMap} from "react-leaflet";
import { WMSTileLayer, LayersControl} from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;
import './Map.css';

function Event() {
  const map =  useMapEvents({
    async moveend(event){
      fetch("http://localhost:3000/api/session/", {
      method: 'POST',
      body: JSON.stringify({
        'center': event.target.getCenter(),
        'zoom': event.target.getZoom()
      })
    })
    }
  })
  return null
}

function LocationMarkers() {
  const [markers, setMarkers] = useState([]);
  const map = useMapEvents({
    click(e) {
        // @ts-ignore
        setMarkers(markers => markers.concat([e.latlng]));
    }
  });

  const removeMarker = (index: any) => {
    const newMarkers = markers.filter((_, i) => i !== index);
    setMarkers(newMarkers);
  };


  return (
    <>
      {markers.map((marker,idx) => 
      <Marker 
        key = {idx} 
        position={marker} 
        eventHandlers={
          {
            click(){
              removeMarker(idx);
            }
          }
        }
      />)}
    </>
  );
}

export default function MapView(){
    const mapRef=useRef<any>(null)
    const [center, setCenter] = useState({lat:10.879961,lng:106.810877});
    const [zoom, setZoom] = useState(12);

    useEffect(()=>{
      const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/session/", {method: 'GET'})
      .then(response=>response.json())
      .then(result=>result)
      console.log(response)
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

    console.log('new: ', zoom)
    console.log('new: ', center)
    
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
// export default memo(ViewMap);