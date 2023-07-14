import { SearchResult } from "@/types/Types";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/redux/hooks";

export default function LocationInfor(){
    const item = useAppSelector(state => state.search.address)

    return(
        <List className='list-address bg-white' component="nav" aria-label="main mailbox folders">
            {item && item.address && (
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