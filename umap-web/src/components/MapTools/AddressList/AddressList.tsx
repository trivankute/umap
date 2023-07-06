import { memo, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { SearchResult } from "@/types/Types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { setLocation } from "@/services/locations";
import LocationInfor from "../LocationInfor/LocationInfor";

function AddressList({listPlace}:{
    listPlace: SearchResult[]
}) {
    const [list, setList] = useState(true)
    const [infor, setInfor] = useState(false)
    const [addressInfor, setAddressInfor] = useState<SearchResult>()

    const handleLocation = (item: SearchResult)=>{
        // setLocation(item)
        setList(false)
        setInfor(true)
        setAddressInfor(item)
    }

    return ( <>
        {
            list && listPlace.length > 0 &&
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
        {infor && <LocationInfor item={addressInfor}/>}
        </> );
}

export default memo(AddressList);