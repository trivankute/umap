import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch } from '@fortawesome/free-solid-svg-icons';
import AddressList from '../AddressList/AddressList';
import { motion } from 'framer-motion';
import getAddresses from '@/services/getAddresses';
import { SearchBoxProps, SearchResult } from '@/types/Types';
import LocationInfor from '../LocationInfor/LocationInfor';

export default function SearchBox({ onSearchDirection, setItemMarker }: {
  onSearchDirection: () => void,
  setItemMarker: (item: SearchResult) => void
}) {
  const [searchValue, setSearchValue] = useState('');
  const [listPlace, setListPlace] = useState<SearchResult[]>([]);
  const [list, setList] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true); // Set isLoading to true when starting the search
    const listAddresses = await getAddresses(searchValue);
    console.log(listAddresses);
    setList(true);
    setListPlace(listAddresses);
    setSelectedItem(null);
    setIsLoading(false); // Set isLoading to false after the search is complete
  };

  const handleDirection = () => {
    onSearchDirection();
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

      {isLoading ? (
        <div className="text-center mt-2 bg-white">Loading...</div> 
      ) : selectedItem ? (
        <LocationInfor item={selectedItem} />
      ) : (
        <div className="inline-flex border-0 mt-2 shadow-xl rounded-xl overflow-hidden">
          {list && <AddressList listPlace={listPlace} setSelectedItem={setSelectedItem} setItemMarker={setItemMarker} />}
        </div>
      )}
    </motion.div>
  );
}
