import { SearchResult } from "@/types/Types";
import { memo, useCallback } from "react";
import { Marker, Popup, useMap, Polygon, Polyline } from "react-leaflet";
import L from "leaflet";
import { useAppDispatch } from "@/redux/hooks";
import { setDestination, setSource } from "@/redux/slices/routingSlice";

const redOptions = { color: 'red' }
const limeOptions = { color: 'lime' }
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
  const map = useMap()
  console.log("Border line: ", item.borderLine)
  map.panTo(item.center)
  const dispatch = useAppDispatch()
  const removeMarker = useCallback(() => {
    if (type === "source")
      dispatch(setSource(null))
    else if (type === "destination")
      dispatch(setDestination(null))
  },[])
  const handleDrag = useCallback((e: any) => {
    if(type==="source")
      dispatch(setSource({center: [e.target._latlng.lat, e.target._latlng.lng]}))
    else if(type==="destination")
      dispatch(setDestination({center: [e.target._latlng.lat, e.target._latlng.lng]}))
  },[])

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