'use client'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections, faSearch, faMapMarkerAlt, faCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import './directionBoxStyle.component.css'

interface DirectionBoxProps {
    onDirectionCancel: () => void;
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

const DirectionBox: React.FC<DirectionBoxProps> = (props) => {
        const [listPlace, setListPlace] = useState<SearchResult[]>([]);
        
        const handleSearch = () => {
            setListPlace(addresses)
        };

        const handleCancel = () => {
            props.onDirectionCancel()
        }
  return (
    <div className="direction-container shadow-md">
        <div className="direction-tool">
            <button className="direction-button">
                <FontAwesomeIcon icon={faDirections}/>
            </button>
            <button className="cancel-button" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes}/>
            </button>
        </div>
        <div className="direction-box">
            <div className="direction-start">
                <div className="icon-start">
                    <FontAwesomeIcon icon={faCircle} />
                </div>
                
                <input 
                    type="text"
                    placeholder='Chọn điểm bắt đầu...'
                    className='search-input' 
                />
                <button className="search-button" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch}/>
                </button>
            </div>
            <div className="direction-des">
                <div className="icon-direction">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <input 
                    type="text"
                    placeholder='Chọn điểm đến...'
                    className='search-input'
                />    
                <button className="search-button" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch}/>
                </button>
            </div>
        </div>
        <div className="direction-address">
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
  )
}

export default DirectionBox