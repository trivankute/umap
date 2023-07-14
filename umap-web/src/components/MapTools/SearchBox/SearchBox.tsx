import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch } from '@fortawesome/free-solid-svg-icons';
import AddressList from '../AddressList/AddressList';
import { motion } from 'framer-motion';
import getAddresses from '@/services/getAddresses';
import LocationInfor from '../LocationInfor/LocationInfor';
import { setAddressList, setAddress, setSelect } from '@/redux/slices/searchSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function SearchBox({ onSearchDirection}: {
  onSearchDirection: () => void
}) {
  const [searchValue, setSearchValue] = useState('');

  const select = useAppSelector(state => state.search.select)
  
  const dispatch = useAppDispatch()
        
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if(searchValue===''){
      dispatch(setSelect(null))
      dispatch(setAddressList(null))
      dispatch(setAddress(null))
    }
  };

  const handleSearch = async () => {
    const listAddresses = await getAddresses(searchValue);

    dispatch(setSelect('list'))
    dispatch(setAddressList(listAddresses))
  };

  const handleDirection = () => {
    onSearchDirection();
    dispatch(setSelect(null))
    dispatch(setAddressList(null))
    dispatch(setAddress(null))
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -200 }}
      transition={{ duration: 0.5 }}
      key="search-box"
      className="fixed flex flex-col m-2 max-w-[300px] md:max-w-[400px]"
    >
      <div className="inline-flex bg-white items-center border border-white shadow-xl p-2 rounded-lg overflow-hidden gap-x-2 max-w-[100%]">
        <label htmlFor="search-input"></label>
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="search-input w-full outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-sm md:text-base"
          value={searchValue}
          onChange={handleInputChange}
        />

        <button
          className="group min-w-[40px] ml-0 search-button d-flex justify-center items-center hover:bg-green-400 hover:border-transparent"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} className="faSearch group-hover:text-white" />
        </button>
        <button
          className="group min-w-[40px] ml-0 search-direction d-flex justify-center items-center rounded-lg hover:bg-gray-100"
          onClick={handleDirection}
        >
          <FontAwesomeIcon icon={faDirections} className="faDirections group-hover:text-green-400" />
        </button>
      </div>

      {select==='infoBox'&&<LocationInfor/>}

      <div className="inline-flex border-0 mt-2 shadow-xl rounded-xl overflow-hidden">
        {select==='list' && <AddressList/>}
      </div>
    </motion.div>
  );
}
