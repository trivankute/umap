'use client'
import { useState, memo, useRef, useEffect } from "react";
import { useMapEvents, Marker, Popup, Circle } from "react-leaflet";
import { PopupInfor } from "@/types/Types";
import { motion } from 'framer-motion'
import './MainMarker.css'
import CircleFilter, { returnRightIconByType } from "../CircleFilter/CircleFilter";
import L from 'leaflet'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDestination, setSource } from "@/redux/slices/routingSlice";
import "node_modules/leaflet.awesome-markers";
import InformationMarker from "../InformationMarker/InformationMarker";
import useCancelableSWR from "@/pages/api/utils/useCancelableSWR";
import getAddress from "@/services/getAddress";

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [58, 50],
});

// @ts-ignore
// https://www.npmjs.com/package/leaflet.awesome-markers
var Icon = L.AwesomeMarkers.icon({
  icon: "fa-map",
  prefix: "fa",
  markerColor: "red",
  iconColor: "white",
  extraClasses:"animate-spin"
});

async function getSource(lng: any, lat: number){
  const source =await getAddress(lng, lat)
  console.log('source: ', source)
  return source
}

function PopUpData({ data, mainMarkerPos }: { data: PopupInfor, mainMarkerPos: any }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <div className="font-semibold">Địa chỉ:</div>
        <div>
          {data.address}
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="font-semibold w-15">Type:</div>
        <div>
          {data.type}
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
      <div className="flex space-x-1">
        <div className="font-semibold w-15">Khoảng cách so với mainMarker:</div>
        <div>
          {Math.round(L.latLng(mainMarkerPos[0], mainMarkerPos[1]).distanceTo(L.latLng(parseFloat(data.lat), parseFloat(data.lng))))}m
        </div>
      </div>
    </div>
  )
}

function SetPopup({ position, markerRef, setCirclePos, mapRef }: { mapRef: any, position: number[], markerRef: any, setCirclePos: any }) {

  let [{ data, error, isLoading }, controller]:any = useCancelableSWR(`http://localhost:3000/api/map/getAddress/fromCoor?lat=${position[0]}&lng=${position[1]}`, {})

  useEffect(() => {
    if (markerRef && markerRef.current) {
      markerRef?.current?.openPopup()
      mapRef.current.flyTo([position[0], position[1]], mapRef.current.getZoom())
    }
  }, [position[0], position[1], markerRef && markerRef.current, isLoading])

  useEffect(()=>{
    return () => {
      controller.abort();
    }
  },[position[0], position[1]])

  useEffect(() => {
    if (data) {
      {
        setCirclePos(data.data)
      }
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
        {data && <PopUpData data={data.data} mainMarkerPos={position} />}
      </Popup>
    </motion.div>
  );
}

function PopUpForLoading({ markerRef, markerPos }: { markerPos: any, markerRef: any }) {
  useEffect(() => {
    markerRef?.current?.openPopup()
  }, [markerRef && markerRef.current, markerPos[0], markerPos[1]])

  return (<>
    <motion.div
      initial={{ scale: 0.5, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0.5 }}
      transition={{ duration: 1 }}
    >
      <Popup className="drop-shadow-md">
        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
      </Popup>
    </motion.div>
  </>)
}

function MainMarker(props: any) {
  const [circlePos, setCirclePos] = useState<any>(null);
  const markerRef = useRef<any>(null)
  const dispatch = useAppDispatch()
  const { source, destination } = useAppSelector(state => state.routing)
  useMapEvents({
     async click(e) {
      if (source === "readyToSet") {
        const sourceMarker = await getSource(e.latlng.lng, e.latlng.lat)
        console.log("Get source", sourceMarker)
        dispatch(setSource({ 
          address: sourceMarker.data.address,
          center: [sourceMarker.data.lat, sourceMarker.data.lng] 
        }))
        return;
      }
      else if (destination === "readyToSet") {
        const destinationMarker = await getSource(e.latlng.lng, e.latlng.lat)
        dispatch(setDestination({ 
          address: destinationMarker.data.address,
          center: [destinationMarker.data.lat, destinationMarker.data.lng] 
        }))
        return;
      }
      else if (props.interactMode !== 'filter') {
        // @ts-ignore
        props.setPosition([e.latlng.lat, e.latlng.lng]);
        // fly but current zoom
        props.mapRef.current.flyTo([e.latlng.lat, e.latlng.lng], props.mapRef.current.getZoom())
        props.setInteractMode('mainMarkerOn')
      }
    }
  });

  const removeMarker = () => {
    props.setPosition([]);
    setCirclePos(null);
    props.setInteractMode('mainMarkerOff')
  };

  return (
    <>
      {
        props.interactMode !== 'mainMarkerOff' &&
        <div className='marker'>
          <Marker
            draggable={true}
            ref={markerRef}
            position={props.position}
            icon={Icon}
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
              props.interactMode === 'mainMarkerOn' &&
              <>
                <SetPopup mapRef={props.mapRef} position={props.position} markerRef={markerRef} setCirclePos={setCirclePos} />
                {
                  circlePos &&
                  <>
                    <Circle
                      center={{ lat: circlePos.lat, lng: circlePos.lng }}
                      pathOptions={{ color: 'green' }}
                      radius={10} />
                    <InformationMarker 
                      position= {[circlePos.lat, circlePos.lng]}
                      text= {circlePos.address}
                      type= {circlePos.type}
                      mainMarkerPos= {{ lat: props.position[0], lng: props.position[1] }}
                      faForIcon= {returnRightIconByType(circlePos.type)}
                    />
                  </>
                }
              </>
            }
            {
              props.interactMode === 'filter' && props.fetchingFilter &&
              <>
                <PopUpForLoading markerRef={markerRef} markerPos={props.position} />
              </>
            }
            {props.interactMode === 'filter' &&
              <CircleFilter mapRef={props.mapRef} addressList={props.addressList}
                fetchingFilter={props.fetchingFilter} mainMarker={props.position} />
            }
          </Marker>
        </div>
      }
    </>
  );
}

export default memo(MainMarker);