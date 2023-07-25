'use client'
import React, { useState, memo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch, faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import './directionBoxStyle.component.css'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddressList from '../AddressList/AddressList';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import getAddresses from '@/services/getAddresses';
import { setAddressList, setAddress, setSelect } from '@/redux/slices/searchSlice';
import LocationInfor from '../LocationInfor/LocationInfor';
import { setDestination, setDirectionInfor, setSource, setState } from '@/redux/slices/routingSlice';
import getDirection from '@/services/getDirection';
import { LoadingForSearchBox } from '../SearchBox/SearchBox';
import DirectionList from '../DirectionsList/DirectionList';
import { setDirectionState, setEndPointState, setStartPointState } from '@/redux/slices/loadingSlice';
import { setPopUp } from '@/redux/slices/popupSlice';

interface DirectionBoxProps {
    onDirectionCancel: () => void;
}

const DirectionBox: React.FC<DirectionBoxProps> = (props) => {
        const select = useAppSelector(state => state.search.select)
        const source = useAppSelector(state => state.routing.source)
        const destination = useAppSelector(state => state.routing.destination)
        const directionInfor = useAppSelector(state => state.routing.directionInfor)
        const directionState = useAppSelector(state => state.loading.directionState)
        const startPointState = useAppSelector(state => state.loading.startPointState)
        const endPointState = useAppSelector(state => state.loading.endPointState)
        
        const dispatch = useAppDispatch()

        const [sourceValue, setSourceValue] = useState<string>('');

        const [destinationValue, setDestinationValue] = useState<any>(
            destination&&destination!=='readyToSet'?destination.address:''
            );
        
        const handleInputChangeSource = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSourceValue(event.target.value);
            if(event.target.value===''){
                setSourceValue('')
                dispatch(setSelect(null))
                dispatch(setAddressList(null))
                dispatch(setAddress(null))
                dispatch(setSource(null))
                dispatch(setDirectionInfor(null))
                dispatch(setPopUp(null))
            }
        };

        const handleSearchSource = async () => {
            dispatch(setStartPointState(true))
            dispatch(setAddressList(null))
            if(sourceValue !== '')
            {
                const listAddresses = await getAddresses(sourceValue);
            
                dispatch(setStartPointState(false))
                dispatch(setSelect('list'))
                dispatch(setAddressList(listAddresses))
                dispatch(setState('source'))
                dispatch(setDirectionInfor(null))
            }
            else {
                dispatch(setStartPointState(false))
            }
        };

        const handleInputChangeDestination = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDestinationValue(event.target.value);
            if(event.target.value===''){
                setDestinationValue('')
                dispatch(setSelect(null))
                dispatch(setAddressList(null))
                dispatch(setAddress(null))
                dispatch(setDestination(null))
                dispatch(setDirectionInfor(null))
            }
        };

        const handleSearchDestination = async () => {
            dispatch(setEndPointState(true))
            dispatch(setAddressList(null))
            if(destinationValue !== '')
            {
                const listAddresses = await getAddresses(destinationValue);
            
                dispatch(setEndPointState(false))
                dispatch(setSelect('list'))
                dispatch(setAddressList(listAddresses))
                dispatch(setState('destination'))
                dispatch(setDirectionInfor(null))
            }
            else
            {
                dispatch(setEndPointState(false))
            }
        };

        const handleDirection = async () => {
            
            if(typeof source === 'string' || typeof destination === 'string') return
            if(source && destination){
                dispatch(setDirectionState(true))
                const directionsDetail = await getDirection(source, destination, 'foot')

                if(source?.address)
                    setDestinationValue(source?.address)
                else setDestinationValue('')
                if(destination?.address)
                    setSourceValue(destination?.address)
                else setSourceValue('')
                dispatch(setDirectionInfor(directionsDetail))
                
                dispatch(setSelect(null))
                if(directionsDetail) dispatch(setDirectionState(false))
            }
        }
        
        const handleSwap = async () => {
            if(typeof source === 'string' || typeof destination === 'string') return
            const oldDestination = destination
            dispatch(setDestination(source))
            if(source?.address)
                setDestinationValue(source?.address)
            else 
                setDestinationValue('')
            dispatch(setSource(oldDestination))
            if(oldDestination?.address)
                setSourceValue(oldDestination?.address)
            else setSourceValue('')
            if(source&&oldDestination){
                dispatch(setDirectionState(true))
                const changedDirection = await getDirection(oldDestination, source, 'foot')
                dispatch(setDirectionInfor(changedDirection))
                dispatch(setDirectionState(false))
            }
        }

        const handleCancel = () => {
            dispatch(setDestination(null))
            dispatch(setSource(null))
            dispatch(setDirectionInfor(null))
            props.onDirectionCancel()
        }

        useEffect(()=>{
            if(source!==null && source!=='readyToSet' && source.address)
                setSourceValue(source.address)
            else if(source===null)
                setSourceValue('')
            if(destination!==null && destination!=='readyToSet' && destination.address)
                setDestinationValue(destination.address)
            else if(destination===null)
                setDestinationValue('')
        }, [source, destination])
        
  return (
    <motion.div 
        initial={{opacity:0, x: -500}}
        animate={{opacity:1, x: 0}}
        exit={{opacity:0, x: -500}}
        transition={{duration: 0.5}}
        key="direction-box"
        className="bg-white fixed flex flex-col h-screen shadow-xl max-w-[300px] md:max-w-[400px]">
        <div className="direction-tool flex items-center justify-between p-2 border-b-2">
            {
                !directionState?
                <button 
                    className="direction-button w-[40px] d-flex justify-center items-center rounded-md group hover:bg-gray-100"
                    onClick={handleDirection}
                >
                    <FontAwesomeIcon icon={faDirections} className="group-hover:text-green-400"/>
                </button>
                :
                <LoadingForSearchBox/>
            }
            <button 
                className="cancel-button w-[40px] flex justify-center items-center rounded-md group hover:bg-gray-100" 
                onClick={handleCancel}
            >
                <FontAwesomeIcon icon={faTimes} className="group-hover:text-slate-800"/>
            </button>
        </div>
        <div className="direction-box p-2 w-full">
            <form onSubmit={(e)=>{
                e.preventDefault()
                handleSearchSource()
            }} className="direction-start">
                <div className="icon-start w-[40px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                
                <input 
                    type="text"
                    placeholder='Chọn điểm bắt đầu...'
                    className='search-input w-full mr-1 outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent text-sm md:text-base' 
                    value={sourceValue}
                    onChange={handleInputChangeSource}
                />
                {
                    !startPointState ?
                    <button 
                        className="group search-button w-[40px] flex justify-center items-center hover:bg-green-400 hover:border-transparent" 
                        onClick={handleSearchSource}
                    >
                        <FontAwesomeIcon icon={faSearch} className="group-hover:text-white"/>
                    </button>
                    :
                    <LoadingForSearchBox/>
                }
            </form>

            <div className='border border-red-500 rounded-full w-fit hover:bg-red-300 cursor-pointer ml-auto mr-2'
                    onClick={handleSwap}
                >
                    <SwapHorizIcon className='text-red-500'/>
            </div>

            <form onSubmit={(e)=>{
                e.preventDefault()
                handleSearchDestination()
            }} className="direction-des">
                <div className="icon-direction w-[40px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <input 
                    type="text"
                    placeholder='Chọn điểm đến...'
                    className='search-input w-full mr-1 outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent text-sm md:text-base'
                    value={destinationValue}
                    onChange={handleInputChangeDestination}
                />
                {
                    !endPointState ?
                    <button
                        className="group search-button w-[40px] flex justify-center items-center hover:bg-green-400 hover:border-transparent" 
                        onClick={handleSearchDestination}
                    >
                        <FontAwesomeIcon icon={faSearch} className="group-hover:text-white"/>
                    </button>
                    :
                    <LoadingForSearchBox/>
                }
            </form>
        </div>
        {select==='infoBox' && <LocationInfor/>}

      <div className="inline-flex border-0 mt-2 shadow-xl rounded-xl overflow-hidden">
        {select==='list' && <AddressList/>}
      </div>

      <div className="inline-flex border-0 mt-2 shadow-xl rounded-xl overflow-hidden">
        {directionInfor&&<DirectionList/>}
      </div>
    </motion.div>
  )
}

export default memo(DirectionBox)