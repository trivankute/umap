'use client'
import { useState, memo, useRef, useEffect, useCallback } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import { PopupInfor } from "@/types/Types";
import useSWR from "swr"
import { motion } from 'framer-motion'

function PopUpData({ data }: { data: PopupInfor }) {
  return (
    <>
      <p><p className="font-semibold">Địa chỉ:</p> {data.address}</p>
      <p><p className="font-semibold">Vĩ độ:</p> {data.lat} <br /><p className="font-semibold">Kinh độ:</p> {data.lng}</p>
    </>
  )
}

function SetPopup({ position, markerRef }: { position: number[], markerRef: any }) {

  const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading }
    = useSWR(`/api/map/getAddress/fromCoor?lat=${position[0]}&lng=${position[1]}`, fetcher)

  useEffect(() => {
    markerRef.current.openPopup()
  }, [position[0], position[1]])

  // render data
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0.5 }}
      transition={{ duration: 1 }}
    >
      <Popup className="drop-shadow-md">
        {error && "There is some error"}
        {isLoading && "Loading..."}
        {data && <PopUpData data={data.data} />}
      </Popup>
    </motion.div>
  );
}

function MainMarker({ mapRef }: { mapRef: any }) {
  const [position, setPosition] = useState<any>([]);
  const markerRef = useRef<any>(null)

  useMapEvents({
    click(e) {
      // @ts-ignore
      setPosition([e.latlng.lat, e.latlng.lng]);
      // fly but current zoom
      mapRef.current.flyTo([e.latlng.lat, e.latlng.lng], mapRef.current.getZoom())
    }
  });

  const removeMarker = useCallback(() => {
    setPosition([]);
  }, []);


  return (
    <>
      {
        position.length > 0 &&
        <Marker
          ref={markerRef}
          position={position}
          eventHandlers={
            {
              dblclick() {
                removeMarker();
              }
            }
          }
        >
          <SetPopup position={position} markerRef={markerRef} />
        </Marker>
      }
    </>
  );
}

export default memo(MainMarker);