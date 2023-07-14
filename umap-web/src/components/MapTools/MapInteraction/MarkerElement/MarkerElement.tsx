import { SearchResult } from "@/types/Types";
import { memo } from "react";
import { Marker, Popup, useMap, Polygon, Polyline } from "react-leaflet";
import L from "leaflet";

const redOptions = { color: 'red' }
const limeOptions = { color: 'lime' }
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [58, 50],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [58, 50],
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

function MarkerElement({ mapRef, item }: { mapRef: any, item: SearchResult }) {
    const map =useMap()
    console.log("Border line: ", item.borderLine)
    map.panTo(item.center)
  
    return (
      <>
        {
          item &&
          <Marker
            ref={mapRef}
            position={item.center}
            icon={blueIcon}
          >
            <Popup className="drop-shadow-md">
              <PopUpData data={item}/>
            </Popup>
          </Marker>
        }
        {
          item.borderLine && (item.searchMode === 'ward'||item.searchMode === 'district') &&
          <Polygon pathOptions={limeOptions} positions={item.borderLine} />
        }
        {
          item.borderLine && item.searchMode === 'street' &&
          <Polyline pathOptions={redOptions} positions={item.borderLine} />
        }
      </>
    );
  }
  
  export default memo(MarkerElement);