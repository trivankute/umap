import { memo } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { SearchResult } from "@/types/Types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

function AddressList({listPlace, setSelectedItem, setItemMarker}:{
    listPlace: SearchResult[],
    setSelectedItem: (item: SearchResult) => void,
    setItemMarker: (item: SearchResult) => void
}) {
    const handleLocation = (item: SearchResult) => {
        setSelectedItem(item);
        setItemMarker(item)
    }

    return ( <>
        {
            listPlace.length > 0 &&
            <List className='list-address bg-white' component="nav" aria-label="main mailbox folders">
                {listPlace.map((item) => {
                return (
                    <div key={item?.osm_id}>
                    <ListItem
                        onClick={()=>handleLocation(item)}
                        className="hover:bg-gray-100 cursor-pointer"
                    >
                        <ListItemIcon>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </ListItemIcon>
                        <ListItemText primary={item?.address} />
                    </ListItem>
                    <Divider />
                    </div>
                );
                })}
            </List>
        }
        {
            listPlace.length === 0 && 
            <div className="bg-white ">
                <p>NOT FOUND</p> 
            </div>
        }
        </> );
}

export default memo(AddressList);