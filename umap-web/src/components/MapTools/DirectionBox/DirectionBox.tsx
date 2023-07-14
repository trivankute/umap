'use client'
import React, { useState, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch, faMapMarkerAlt, faCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './directionBoxStyle.component.css'
import AddressList from '../AddressList/AddressList';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import getAddresses from '@/services/getAddresses';
import { setAddressList, setAddress, setSelect } from '@/redux/slices/searchSlice';
import LocationInfor from '../LocationInfor/LocationInfor';
import { setState } from '@/redux/slices/routingSlice';

interface DirectionBoxProps {
    onDirectionCancel: () => void;
}

const DirectionBox: React.FC<DirectionBoxProps> = (props) => {
        const select = useAppSelector(state => state.search.select)
        const dispatch = useAppDispatch()

        const [sourceValue, setSourceValue] = useState('');
        const [destinationValue, setDestinationValue] = useState('');
        
        const handleInputChangeSource = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSourceValue(event.target.value);
            if(sourceValue===''){
                dispatch(setSelect(false))
                dispatch(setAddressList(null))
                dispatch(setAddress(null))
            }
        };

        const handleSearchSource = async () => {
            const listAddresses = await getAddresses(sourceValue);
        
            dispatch(setSelect(false))
            dispatch(setAddressList(listAddresses))
            dispatch(setState('source'))
        };

        const handleInputChangeDestination = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDestinationValue(event.target.value);
            if(destinationValue===''){
                dispatch(setSelect(false))
                dispatch(setAddressList(null))
                dispatch(setAddress(null))
            }
        };

        const handleSearchDestination = async () => {
            const listAddresses = await getAddresses(destinationValue);
        
            dispatch(setSelect(false))
            dispatch(setAddressList(listAddresses))
            dispatch(setState('destination'))
        };

        const handleCancel = () => {
            props.onDirectionCancel()
        }
  return (
    <motion.div 
        initial={{opacity:0, x: -500}}
        animate={{opacity:1, x: 0}}
        exit={{opacity:0, x: -500}}
        transition={{duration: 0.5}}
        key="direction-box"
        className="bg-white fixed flex flex-col h-screen shadow-xl max-w-[300px] md:max-w-[400px]">
        <div className="direction-tool flex items-center justify-between p-2 border-b-2">
            <button className="direction-button w-[40px] d-flex justify-center items-center rounded-md group hover:bg-gray-100">
                <FontAwesomeIcon icon={faDirections} className="group-hover:text-green-400"/>
            </button>
            <button 
                className="cancel-button w-[40px] flex justify-center items-center rounded-md group hover:bg-gray-100" 
                onClick={handleCancel}
            >
                <FontAwesomeIcon icon={faTimes} className="group-hover:text-slate-800"/>
            </button>
        </div>
        <div className="direction-box p-2 w-full">
            <div className="direction-start">
                <div className="icon-start w-[40px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faCircle} />
                </div>
                
                <input 
                    type="text"
                    placeholder='Chọn điểm bắt đầu...'
                    className='search-input w-full outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent text-sm md:text-base' 
                    value={sourceValue}
                    onChange={handleInputChangeSource}
                />
                <button 
                    className="group search-button w-[40px] flex justify-center items-center hover:bg-green-400 hover:border-transparent" 
                    onClick={handleSearchSource}
                >
                    <FontAwesomeIcon icon={faSearch} className="group-hover:text-white"/>
                </button>
            </div>
            <div className="direction-des">
                <div className="icon-direction w-[40px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <input 
                    type="text"
                    placeholder='Chọn điểm đến...'
                    className='search-input w-full outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent text-sm md:text-base'
                    value={destinationValue}
                    onChange={handleInputChangeDestination}
                />
                <button
                    className="group search-button w-[40px] flex justify-center items-center hover:bg-green-400 hover:border-transparent" 
                    onClick={handleSearchDestination}
                >
                    <FontAwesomeIcon icon={faSearch} className="group-hover:text-white"/>
                </button>
            </div>
        </div>
        {select&&<LocationInfor/>}

      <div className="inline-flex border-0 mt-2 shadow-xl rounded-xl overflow-hidden">
        {!select && <AddressList/>}
      </div>
    </motion.div>
  )
}

export default memo(DirectionBox)