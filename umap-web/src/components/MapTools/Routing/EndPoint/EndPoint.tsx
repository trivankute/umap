import { memo } from "react";
import { Marker } from "react-leaflet";
import L from 'leaflet'

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [22, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

function EndPoint({position, setPosition}:{position:any, setPosition:any}) {
    const removeMarker = () => {
        setPosition(null)
    }
    return ( <>
        <Marker position={position}
        icon={redIcon}
        draggable={true}
        eventHandlers={
          {
            dblclick() {
              removeMarker();
            },
            dragend(e) {
              setPosition([e.target._latlng.lat, e.target._latlng.lng])
            }
          }
        }
        ></Marker>
    </> );
}

export default memo(EndPoint);