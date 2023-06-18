'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faClock, faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import "./styles.component.css"

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
    display_name: '69 Tan Lap, Dong Hoa, Di An, Binh Duong'
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
    <div className='container md:w-96 w-72 p-2'>
        <div className="search-container shadow-md">
            <label htmlFor="search-input"></label>
            <input
                type="text"
                placeholder="Tìm kiếm"
                className="search-input"
                value={searchValue}
                onChange={handleInputChange}
            />

            <button className="search-button d-flex justify-center items-center" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className='faSearch'/>
            </button>
            <button className="search-direction d-flex justify-center items-center" onClick={handleDirection}>
                <FontAwesomeIcon icon={faDirections} className='faDirections'/>
            </button>
        </div>

        <div className='search-box'>
          <List className='list-address' component="nav" aria-label="main mailbox folders">
            {listPlace.map((item) => {
              return (
                <div key={item?.place_id}>
                  <ListItem
                    onClick={() => {
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </ListItemIcon>
                    <ListItemText primary={item?.display_name} />
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </List>
      </div>
    </div>
  );
}

export default SearchBox