import { SearchResult } from "@/types/Types";
import { memo } from "react";
import { Marker, Popup, useMap, Polygon, Polyline } from "react-leaflet";

const redOptions = { color: 'red' }
const limeOptions = { color: 'lime' }
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
    
    map.panTo(item.center)
  
    return (
      <>
        {
          item &&
          <Marker
            ref={mapRef}
            position={item.center}
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