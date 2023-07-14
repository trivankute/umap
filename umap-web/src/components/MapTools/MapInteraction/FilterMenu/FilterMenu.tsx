import { memo, useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import clsx from "clsx";
import AmentitiesList from "./Amenities";
import FilterMenuItem from "./FilterMenuItem";
import Draggable from "react-draggable";
import useCancelableSWR from "@/pages/api/utils/useCancelableSWR";

interface FilterMenuProps {
    show: boolean,
    setShow: (show: boolean) => void,
    setShowContextMenu: any,
    setInteractMode: any,
    interactMode: 'mainMarkerOn' | 'mainMarkerOff' | 'filter',
    position: { top: number, left: number },
    setPosition: any,
    mainMarkerPosition: any,
    setAddressList: any,
    mapRef: any,
    setFetchingFilter: any,
    fetchingFilter: any,
}

function FetchFilter(props: any) {
    props.mapRef.current.flyTo(props.mainMarker, 18);
    let [{ data }, controller]: any = useCancelableSWR(`http://localhost:3000/api/map/getAddresses/fromRadiusOfCoor?lat=${props.mainMarker[0]}&lng=${props.mainMarker[1]}&radius=${props.radius}`, {})
    useEffect(() => {
        return () => {
            console.log("unmount")
            controller.abort();
        }
    }, [])
    if (data) {
        const addressList = data.data;
        let filteredAddressList = null;
        if (props.type !== 'none')
            filteredAddressList = addressList.filter((address: any) => address.type === props.type)
        else
            filteredAddressList = addressList;
        props.setAddressList(filteredAddressList);
        props.setFetchingFilter(false);
    }
    return <></>
}

function FilterMenu(props: FilterMenuProps) {
    const [radius, setRadius] = useState<number | boolean>(50);
    const [type, setType] = useState<string>('none');

    const fetchHandler = () => {
        if (props.fetchingFilter > 0) {
            props.setFetchingFilter(false);
            props.setAddressList([]);
        }
        else
            props.setFetchingFilter(radius);
    }

    const closeHandler = () => {
        props.setShow(false);
        props.setAddressList([]);
        props.setInteractMode('mainMarkerOn');
        props.setFetchingFilter(false);
    }

    const turnBackHandler = () => {
        props.setShow(false);
        props.setShowContextMenu(true);
        props.setAddressList([]);
        props.setInteractMode('mainMarkerOn');
        props.setFetchingFilter(false);
    }

    return (
        <>
            {props.fetchingFilter && <FetchFilter radius={radius} mainMarker={props.mainMarkerPosition}
                mapRef={props.mapRef} setAddressList={props.setAddressList} type={type} setFetchingFilter={props.setFetchingFilter} />}
            <AnimatePresence>
                {
                    props.show &&
                    <motion.div
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className={"w-fit h-fit bg-white absolute rounded-md shadow-xl drop-shadow-xl overflow-hidden"}
                        style={{ zIndex: 10001, top: props.position.top, left: props.position.left, originX: 0, originY: 0 }}>
                        <Draggable onDrag={(event: any, ui: any) => {
                            const { x, y } = ui;
                            props.setPosition({ top: props.position.top + y, left: props.position.left + x })
                        }}>
                            <div className="w-full h-10 bg-white cursor-move p-1">
                                {/* <CloseButton style={{float:'right',
                            backgroundSize:"cover", 
                            width:"40px", height:"40px"}}></CloseButton> */}
                                <button onClick={closeHandler} type="button" className="hover:bg-neutral-200"
                                    aria-label="Close" style={{ float: 'right' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-x " viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                                <button onClick={turnBackHandler} type="button" className="hover:bg-neutral-200"
                                    aria-label="turn back" style={{ float: 'left' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-return-left " viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
                                    </svg>
                                </button>
                            </div>
                        </Draggable>

                        <div className="w-full h-fit border-b border-gray-300 flex justify-around items-center space-x-2 p-2">
                            <div onClick={() => { setRadius(50) }} className={clsx("w-8 h-8 flex justify-center items-center rounded-md text-xs border-b cursor-pointer hover:bg-gray-200 overflow-hidden",
                                {
                                    "bg-gray-200": radius === 50
                                })}>
                                50m
                            </div>
                            <div onClick={() => { setRadius(100) }} className={clsx("w-8 h-8 flex justify-center items-center rounded-md text-xs border-b cursor-pointer hover:bg-gray-200 overflow-hidden",
                                {
                                    "bg-gray-200": radius === 100
                                })}>
                                100m
                            </div>

                            <div onClick={fetchHandler}
                                className={clsx("w-8 h-8 flex justify-center items-center rounded-md text-xs border-b cursor-pointer hover:bg-gray-200 overflow-hidden")}>
                                <div className="flex items-center justify-center">
                                    {
                                        props.fetchingFilter ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            :
                                            <svg className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                            </svg>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-fit text-xs flex items-center p-2">
                            Choose type of building:
                        </div>
                        <div className="w-full max-h-64 p-2 flex flex-col overflow-auto space-y-2">
                            {
                                AmentitiesList.map((amenity) =>
                                    <FilterMenuItem amenity={amenity}
                                        setType={setType}
                                        type={type}
                                    />
                                )
                            }
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    );
}

export default memo(FilterMenu);