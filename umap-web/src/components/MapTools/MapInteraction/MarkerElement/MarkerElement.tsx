import { SearchAreaResult, SearchResult } from "@/types/Types";
import { useState, useCallback, memo, RefObject } from "react";
import { MapContainerProps, Marker, Popup, useMap, Polygon, Polyline } from "react-leaflet";
import { PopupInfor } from "@/types/Types";

const redOptions = { color: 'red' }
const limeOptions = { color: 'lime' }
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

function MarkerElement({ mapRef, item }: { mapRef: any, item: SearchResult }) {
    const map =useMap()

    const data = {
      address: item.address,
      lng: String(item.center[0]),
      lat: String(item.center[1]),
      type: item.type,
      typeOfShape: item.typeOfShape
    }

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
              <PopUpData data={data}/>
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