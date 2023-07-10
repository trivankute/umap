'use client'
import { useState, memo, useRef, useEffect, useCallback } from "react";
import { useMapEvents, Marker, Popup, Circle } from "react-leaflet";
import { PopupInfor } from "@/types/Types";
import useSWR from "swr"
import { motion } from 'framer-motion'
import './MainMarker.css'
import Loading from "@/components/ForLoading/Loading/Loading";



function PopUpData({ data }: { data: PopupInfor }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <div className="font-semibold">Địa chỉ:</div>
        <div>
          {data.address}
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="font-semibold w-15">Vĩ độ:</div>
        <div>
          {data.lat}
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="font-semibold w-15">Kinh độ:</div>
        <div>
          {data.lng}
        </div>
      </div>
    </div>
  )
}

function SetPopup({ position, markerRef, setCirclePos }: { position: number[], markerRef: any, setCirclePos: any }) {

  const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading }
    = useSWR(`/api/map/getAddress/fromCoor?lat=${position[0]}&lng=${position[1]}`, fetcher)

  useEffect(() => {
    if(markerRef&&markerRef.current)
      markerRef?.current?.openPopup()
  }, [position[0], position[1], markerRef&&markerRef.current, isLoading])

  useEffect(() => {
    if (data) {
      setCirclePos([data.data.lat, data.data.lng])
    }
  }, [data])

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

function PopUpForLoading({markerRef}:{markerRef:any})
{
  useEffect(()=>{
    markerRef?.current?.openPopup()
  },[])

  return (<>
    <motion.div
      initial={{ scale: 0.5, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0.5 }}
      transition={{ duration: 1 }}
    >
      <Popup className="drop-shadow-md">
        <Loading/>
      </Popup>
    </motion.div>
  </>)
}

function MainMarker(props:any) {
  const [circlePos, setCirclePos] = useState<any>([]);
  const markerRef = useRef<any>(null)
  useMapEvents({
    click(e) {
      // @ts-ignore
      props.setPosition([e.latlng.lat,e.latlng.lng]);
      // fly but current zoom
      props.mapRef.current.flyTo([e.latlng.lat, e.latlng.lng], props.mapRef.current.getZoom())
      props.setInteractMode('mainMarkerOn')
    }
  });

  const removeMarker = () => {
    props.setPosition([]);
    setCirclePos([]);
    props.setInteractMode('mainMarkerOff')
  };

  return (
    <>
      {
        props.interactMode !== 'mainMarkerOff' &&
        <div className='marker'>
          <Marker
            draggable={props.interactMode==='filter'?true:false}
            ref={markerRef}
            position={props.position}
            eventHandlers={
              {
                dblclick() {
                  removeMarker();
                },
                dragend(e) {
                  props.setPosition([e.target._latlng.lat, e.target._latlng.lng])
                }
              }
            }
          >
            {
              <>
                <SetPopup position={props.position} markerRef={markerRef} setCirclePos={setCirclePos} />
                {
                  circlePos.length > 0 &&
                  <Circle
                    center={{ lat: circlePos[0], lng: circlePos[1] }}
                    pathOptions={{ color: 'green' }}
                    radius={10} />
                }
              </>
            }
            {
              props.interactMode === 'filter' && props.fetchingFilter &&
              <PopUpForLoading markerRef={markerRef}/>
            }
            </Marker>
          </div>
      }
    </>
  );
}

export default memo(MainMarker);