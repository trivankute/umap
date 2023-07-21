import { SearchResult } from "@/types/Types";
import { memo, useCallback, useEffect, useState } from "react";
import { Marker, Popup, useMap, Polygon, Polyline } from "react-leaflet";
import L from "leaflet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDestination, setDirectionInfor, setSource } from "@/redux/slices/routingSlice";
import "node_modules/leaflet.awesome-markers";
import getAddress from "@/services/getAddress";
import getDirection from "@/services/getDirection";
import { setDirectionState, setEndPointState, setStartPointState, setStateMenu } from "@/redux/slices/loadingSlice";

const redOptions = { color: 'red' }
const limeOptions = { color: 'lime' }


// @ts-ignore
var redIcon = L.AwesomeMarkers.icon({
  icon: "fa-map-pin",
  prefix: "fa",
  markerColor: "red",
  iconColor: "white",
});

// @ts-ignore
var greenIcon = L.AwesomeMarkers.icon({
  icon: "fa-map-pin",
  prefix: "fa",
  markerColor: "green",
  iconColor: "white",
});

// @ts-ignore
var blueIcon = L.AwesomeMarkers.icon({
  icon: "fa-map-pin",
  prefix: "fa",
  markerColor: "blue",
  iconColor: "white",
});

function PopUpData({ data }: { data: SearchResult }) {
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
          {data.center[0]}
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="font-semibold w-15">Kinh độ:</div>
        <div>
          {data.center[1]}
        </div>
      </div>
    </div>
  )
}

function MarkerElement({ mapRef, item, type }: { mapRef: any, item: SearchResult, type: "source" | "destination" | "select" }) {
  const destination = useAppSelector(state => state.routing.destination)
  const source = useAppSelector(state => state.routing.source)


  const [sourceMarker, setSourceMarker] = useState(source)
  const [destinationMarker, setDestinationMarker] = useState(destination)

  useEffect(()=>{
    console.log('Changed')
    console.log('source: ', source)
    console.log('destination: ', destination)
    if(source)
      setSourceMarker(source)
    if(destination)
      setDestinationMarker(destination)
  }, [source, destination])

  const map = useMap()
  map.panTo(item.center)
  const dispatch = useAppDispatch()
  const removeMarker = useCallback(() => {
    if (type === "source"){
      console.log('delete source')
      dispatch(setSource(null))
      dispatch(setDirectionInfor(null))
    }
    else if (type === "destination"){
      dispatch(setDestination(null))
      dispatch(setDirectionInfor(null))
    }
  },[])
  const handleDrag = useCallback(async (e: any) => {
    if(type==="source") {
        dispatch(setStartPointState(true))
        dispatch(setDirectionInfor(null))
        const data = await getAddress(
          e.target._latlng.lng, e.target._latlng.lat
        )
        
        dispatch(setSource({
          address: data.data.address,
          center: [e.target._latlng.lat, e.target._latlng.lng]
        }))
        dispatch(setStartPointState(false))
        if(destinationMarker&&destinationMarker!=='readyToSet'){
          dispatch(setDirectionState(true))
          dispatch(setDirectionInfor(null))
          const directionsDetail = await getDirection({
            address: data.data.address,
            center: [e.target._latlng.lat, e.target._latlng.lng]
          }, destinationMarker, 'foot')
          dispatch(setDirectionInfor(directionsDetail))
          dispatch(setDirectionState(false))
        }

        dispatch(setStateMenu(null))

    }
    if(type==="destination"){
        dispatch(setEndPointState(true))
        dispatch(setDirectionInfor(null))
        const data = await getAddress(
          e.target._latlng.lng, e.target._latlng.lat
        )
        
        dispatch(setDestination({
          address: data.data.address,
          center: [e.target._latlng.lat, e.target._latlng.lng]
        }))
        dispatch(setEndPointState(false))

        if(sourceMarker&&sourceMarker!=='readyToSet'){
          dispatch(setDirectionState(true))
          dispatch(setDirectionInfor(null))
          const directionsDetail = await getDirection(sourceMarker, {
          address: data.data.address,
          center: [e.target._latlng.lat, e.target._latlng.lng]
          }, 'foot')
          dispatch(setDirectionInfor(directionsDetail))
          dispatch(setDirectionState(false))
        }

        dispatch(setStateMenu(null))
    }
  },[sourceMarker, destinationMarker])

  return (
    <>
      {
        item &&
        <Marker
          draggable={(type==="source"||type==="destination")?true:false}
          ref={mapRef}
          position={item.center}
          icon={type === "source" ? blueIcon : type === "destination" ? redIcon : greenIcon}
          eventHandlers={
            {
              dblclick() {
                removeMarker();
              },
              dragend(e) {
                handleDrag(e)
              }
            }
          }
        >
          <Popup className="drop-shadow-md">
            <PopUpData data={item} />
          </Popup>
        </Marker>
      }
      {
        type === "select" && item.borderLine && (item.searchMode === 'ward' || item.searchMode === 'district') &&
        <Polygon pathOptions={limeOptions} positions={item.borderLine} />
      }
      {
        type === "select" && item.borderLine && item.searchMode === 'street' &&
        <Polyline pathOptions={redOptions} positions={item.borderLine} />
      }
    </>
  );
}

export default memo(MarkerElement);