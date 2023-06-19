'use client'
import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch } from '@fortawesome/free-solid-svg-icons';
import "./styles.component.css"
import AddressList from '../AddressList/AddressList';
import { motion } from 'framer-motion';

interface SearchBoxProps {
  onSearchDirection: () => void;
}

interface SearchResult {
  place_id: string;
  display_name: string;
}

let addresses: SearchResult[] = [
  {
    place_id: '1',
    display_name: '147 Nguyen Cong Tru'
  },

  {
    place_id: '2',
    display_name: '69 Tan Lap, Dong Hoa, Di An, Binh Duong ssssssssssssssssss'
  }
]

const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState<SearchResult[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    console.log('Đã tìm kiếm:', searchValue);
    setListPlace(addresses)
  };

  const handleDirection = () => {
    props.onSearchDirection();
  }
  return (
    <motion.div 
      initial={{opacity:0, y: -200}}
      animate={{opacity:1, y: 0}}
      exit={{opacity:0,  y: -200}}
      transition={{duration: 0.5}}
      key="search-box"
    className='container m-2 max-w-[300px] md:max-w-[400px]'>
      <div className="search-container shadow-xl p-2 rounded-lg overflow-hidden gap-x-2 max-w-[100%]">
        <label htmlFor="search-input"></label>
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="search-input w-full outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-sm md:text-base"
          value={searchValue}
          onChange={handleInputChange}
        />

        <button className="group min-w-[40px] ml-0 search-button d-flex justify-center items-center hover:bg-green-400 hover:border-transparent" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className='faSearch group-hover:text-white' />
        </button>
        <button className="group min-w-[40px] ml-0 search-direction d-flex justify-center items-center rounded-lg hover:bg-gray-100" onClick={handleDirection}>
          <FontAwesomeIcon icon={faDirections} className='faDirections group-hover:text-green-400' />
        </button>
      </div>

      <div className='search-box mt-2 shadow-xl rounded-xl overflow-hidden'>
        <AddressList listPlace={listPlace} />
      </div>
    </motion.div>
  );
}

export default memo(SearchBox)