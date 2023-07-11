import { SearchResult } from "@/types/Types";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt} from "@fortawesome/free-solid-svg-icons";

export default function LocationInfor({item}:{item: SearchResult}){
    return(
        <List className='list-address bg-white' component="nav" aria-label="main mailbox folders">
            {item.address && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faMapMarkedAlt} />
                    </ListItemIcon>
                    <ListItemText primary={`Địa chỉ: ${item.address}`} />
                </ListItem>
            )}
        </List>
    )
}