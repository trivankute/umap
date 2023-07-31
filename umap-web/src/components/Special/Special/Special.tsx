'use client';
import { memo, useState, useEffect, useRef } from "react";
import { peopleInfor } from '../support'
import { Marker, Popup } from "react-leaflet";
import "node_modules/leaflet.awesome-markers";
import HeartsVertical from "../Hearts/HeartsVertical";
import HeartsTrajectory from "../Hearts/HeartsTrajectory";
import { setParagraph, turnOnTeller } from "@/redux/slices/specialSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { specialView } from '../support'
import { map } from "leaflet";

// @ts-ignore
const Icon = L.AwesomeMarkers.icon({
    icon: "fa-heart",
    prefix: "fa",
    markerColor: "pink",
    iconColor: "red",
    extraClasses: "fa-2x animate-bounce"
});

function Special({ mapRef }: { mapRef: any }) {
    const dispatch = useAppDispatch()
    const [startEvent, setStartEvent] = useState(true)
    const eventBeginning = useAppSelector(state => state.special.eventBeginning)
    const audioRef = useRef(null);
    useEffect(() => {
        if (eventBeginning) {
            if (audioRef.current) {
                // @ts-ignore
                audioRef.current.play();
            }
            const handleTimeout = setTimeout(() => {
                setStartEvent(false)
            }, 8000)
            return () => {
                clearTimeout(handleTimeout)
            }
        }
    }, [eventBeginning])

    useEffect(() => {
        if (mapRef.current)
            mapRef.current.flyTo([specialView.lat, specialView.lng], specialView.zoom)
    }, [mapRef, mapRef.curent])
    return (<>
        {
            eventBeginning &&
            <>
                {
                    startEvent ? <HeartsVertical size={100} /> : <HeartsTrajectory />
                }
                <audio ref={audioRef} style={{ zIndex: 11000 }} className="absolute top-14 left-20">
                    <source src="/special/song.mp3" type="audio/mpeg" />
                </audio>
            </>
        }
        {
            // peopleInfor is object
            Object.keys(peopleInfor).map((key: any, index: number) => {
                // @ts-ignore
                const person: any = peopleInfor[key]
                return (
                    <Marker icon={Icon} key={index} position={[person.lat, person.lng]}
                        eventHandlers={
                            {
                                click: (e: any) => {
                                    dispatch(turnOnTeller(key))
                                    dispatch(setParagraph(person.paragraph))
                                    mapRef.current.flyTo([person.lat, person.lng], mapRef.current.getZoom())
                                }
                            }
                        }>
                        <Popup>
                            <div>
                                <h3><span className="font-semibold">Name:</span> {key}</h3>
                                <p><span className="font-semibold">Address:</span> {person.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            })
        }

    </>);
}

export default memo(Special);