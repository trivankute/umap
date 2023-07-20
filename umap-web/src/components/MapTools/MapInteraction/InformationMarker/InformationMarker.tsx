import { memo, useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import L from 'leaflet';
import "node_modules/leaflet.awesome-markers";

function InformationMarker({
    position, text, type, mainMarkerPos, faForIcon
}: {
    position: any,
    text: string,
    type: string,
    mainMarkerPos: any,
    faForIcon: string
}) {
    const markerRef = useRef<any>(null);
    useEffect(() => {
        markerRef?.current?.openPopup()
    }, [
        markerRef && markerRef.current
    ])
    // const greenIcon = new L.Icon({
    //     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    //     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    //     iconSize: [25, 41],
    //     iconAnchor: [12, 41],
    //     popupAnchor: [1, -34],
    //     shadowSize: [41, 41],
    // });
    // @ts-ignore
    var greenIcon = L.AwesomeMarkers.icon({
        icon: faForIcon,
        prefix: "fa",
        markerColor: "green",
        iconColor: "white",
      });
      
    return (<>
        <Marker
            position={position}
            ref={markerRef}
            icon={greenIcon}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0.5 }}
                transition={{ duration: 1 }}
            >
                <Popup className="drop-shadow-md">
                    <div className="space-y-2">
                        <div className="flex flex-col space-y-1">
                            <div className="font-semibold">Địa chỉ:</div>
                            <div>
                                {text}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <div className="font-semibold w-15">Type:</div>
                            <div>
                                {type}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <div className="font-semibold w-15">Vĩ độ:</div>
                            <div>
                                {position[0]}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <div className="font-semibold w-15">Kinh độ:</div>
                            <div>
                                {position[1]}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <div className="font-semibold w-15">Khoảng cách so với mainMarker:</div>
                            <div>
                                {Math.round(L.latLng({lat:mainMarkerPos.lat, lng:mainMarkerPos.lng}).distanceTo(L.latLng(parseFloat(position[0]), parseFloat(position[1]))))}m
                            </div>
                        </div>
                    </div>
                </Popup>
            </motion.div>
        </Marker>
    </>);
}

export default memo(InformationMarker);