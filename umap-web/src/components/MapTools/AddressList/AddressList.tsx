import { memo } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { SearchResult } from "@/types/Types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { setLocation } from "@/services/locations";

function AddressList({listPlace}:{
    listPlace: SearchResult[]
}) {
    const handleLocation = (item: SearchResult)=>{
        setLocation(item)
    }

    return ( <>
        {
            listPlace.length > 0 &&
            <List className='list-address bg-white' component="nav" aria-label="main mailbox folders">
                {listPlace.map((item) => {
                return (
                    <div key={item?.place_id}>
                    <ListItem
                        onClick={()=>handleLocation(item)}
                        className="hover:bg-gray-100 cursor-pointer"
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
        }
        </> );
}

export default memo(AddressList);