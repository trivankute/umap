'use client'

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faClock, faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import "./styles.component.css"
import { SearchResult, SearchBoxProps } from '@/types/Types';
import getAddresses from '@/services/addresses';

const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState<SearchResult[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {
    console.log('Đã tìm kiếm:', searchValue);
    const address = await getAddresses()
    console.log(address)
    setListPlace(address)
  };

  const handleDirection = () => {
    props.onSearchDirection();
  }
  return (
    <div className='container'>
        <div className="search-container shadow-md">
            <label htmlFor="search-input"></label>
            <input
                type="text"
                placeholder="Tìm kiếm"
                className="search-input"
                value={searchValue}
                onChange={handleInputChange}
            />

            <button className="search-button" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className='faSearch'/>
            </button>
            <button className="search-direction" onClick={handleDirection}>
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