import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch } from '@fortawesome/free-solid-svg-icons';
import AddressList from '../AddressList/AddressList';
import { motion } from 'framer-motion';
import getAddresses from '@/services/getAddresses';
import LocationInfor from '../LocationInfor/LocationInfor';
import { setAddressList, setAddress, setSelect } from '@/redux/slices/searchSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export function LoadingForSearchBox() {
  return (<>
    <div className="flex items-center justify-center w-[40px] h-fit p-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-green-400 dark:border-green-300 drop-shadow-xl">
      <div role="status">
        <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
      </div>
    </div>
  </>)
}

export default function SearchBox({ onSearchDirection }: {
  onSearchDirection: () => void
}) {
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const select = useAppSelector(state => state.search.select)

  const dispatch = useAppDispatch()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if (searchValue === '') {
      dispatch(setSelect(null))
      dispatch(setAddressList(null))
      dispatch(setAddress(null))
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true)
    dispatch(setAddressList(null))
    if(searchValue !== '') {
    const listAddresses = await getAddresses(searchValue);
    setSearchLoading(false)
    dispatch(setSelect('list'))
    dispatch(setAddressList(listAddresses))
    }
    else {
      setSearchLoading(false)
    }
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

        {
          !searchLoading ?
            <button
              className="group min-w-[40px] ml-0 search-button d-flex justify-center items-center hover:bg-green-400 hover:border-transparent"
              onClick={handleSearch}
            >
              <FontAwesomeIcon icon={faSearch} className="faSearch group-hover:text-white" />
            </button>
            :
            <LoadingForSearchBox/>
        }
        <button
          className="group min-w-[40px] p-2 ml-0 search-direction d-flex justify-center items-center rounded-lg hover:bg-gray-100"
          onClick={handleDirection}
        >
          <FontAwesomeIcon icon={faDirections} className="faDirections group-hover:text-green-400" />
        </button>
      </div>

      {select === 'infoBox' && <LocationInfor />}

      <div className="inline-flex border-0 mt-2 shadow-xl rounded-xl overflow-hidden">
        {select === 'list' && <AddressList />}
      </div>
    </motion.div>
  );
}
