import { memo, useState } from "react";
import { AnimatePresence, filterProps, motion } from 'framer-motion'
import clsx from "clsx";
import useSWR from "swr"
import AddressList from "../../AddressList/AddressList";
import { Circle } from "react-leaflet";

interface FilterMenuProps {
    show: boolean,
    setShow: (show: boolean) => void,
    setInteractMode: any, 
    interactMode: 'mainMarkerOn' | 'mainMarkerOff' | 'filter',
    position: { top: number, left: number }
    mainMarkerPosition: any,
    setAddressList: any,
    mapRef:any,
    setFetchingFilter:any,
    fetchingFilter:any
}

function FetchFilter(props:any){
    props.mapRef.current.flyTo(props.mainMarker, 18);

    const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());
    const { data, error, isLoading }
    = useSWR(`http://localhost:3000/api/map/getAddresses/fromRadiusOfCoor?lat=${props.mainMarker[0]}&lng=${props.mainMarker[1]}&radius=${props.radius}`, fetcher)
    if(data){
        const addressList = data.data;
        let filteredAddressList = null;
        if(props.type!=='none')
            filteredAddressList = addressList.filter((address:any) => address.type===props.type)
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

    const handleClick = ()=>{
       props.setFetchingFilter(true);
    }

    return (
        <>
            {props.fetchingFilter && <FetchFilter radius={radius} mainMarker={props.mainMarkerPosition} 
            mapRef={props.mapRef} setAddressList={props.setAddressList} type={type} setFetchingFilter={props.setFetchingFilter}/>}
            <AnimatePresence>
                {
                    props.show &&
                    <motion.div
                        // transform origin on top left
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className={"w-fit h-fit bg-white absolute rounded-md shadow-xl drop-shadow-xl overflow-hidden"}
                        style={{ zIndex: 10001, top: props.position.top, left: props.position.left, originX: 0, originY: 0 }}>
                        <div className="w-full h-fit text-xs flex items-center p-2">
                            Choose radius:
                        </div>
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

                            <div onClick={handleClick} 
                            className={clsx("w-8 h-8 flex justify-center items-center rounded-md text-xs border-b cursor-pointer hover:bg-gray-200 overflow-hidden")}>
                                <div className="flex items-center justify-center">
                                    <svg className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-fit text-xs flex items-center p-2">
                            Choose type of building:
                        </div>
                        <div className="w-full max-h-64 p-2 flex flex-col overflow-auto space-y-2">
                            <div className="flex items-center">
                                <input onChange={(e: any) => {
                                    setType(e.target.value)
                                }} id="none" type="radio" value="none" name="filter" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"></input>
                                <label htmlFor="none" className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 capitalize">none</label>
                            </div>
                            <div className="flex items-center">
                                <input onChange={(e: any) => {
                                    setType(e.target.value)
                                }} id="cafe" type="radio" value="cafe" name="filter" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"></input>
                                <label htmlFor="cafe" className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 capitalize">cafe</label>
                            </div>
                            <div className="flex items-center">
                                <input onChange={(e: any) => {
                                    setType(e.target.value)
                                }} id="hospital" type="radio" value="hospital" name="filter" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"></input>
                                <label htmlFor="hospital" className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 capitalize">hospital</label>
                            </div>
                            <div className="flex items-center">
                                <input onChange={(e: any) => {
                                    setType(e.target.value)
                                }} id="school" type="radio" value="school" name="filter" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"></input>
                                <label htmlFor="school" className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 capitalize">school</label>
                            </div>
                            <div className="flex items-center">
                                <input onChange={(e: any) => {
                                    setType(e.target.value)
                                }} id="store" type="radio" value="store" name="filter" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"></input>
                                <label htmlFor="store" className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 capitalize">store</label>
                            </div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    );
}

export default memo(FilterMenu);