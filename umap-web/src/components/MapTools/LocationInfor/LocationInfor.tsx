import { Infor, SearchResult } from "@/types/Types";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCity, faGlobe, faHouse, faMap, faMapMarkedAlt, faNetworkWired, faRoad } from "@fortawesome/free-solid-svg-icons";

export default function LocationInfor({item}:{item: Infor}){
    return(
        <List className='list-address bg-white' component="nav" aria-label="main mailbox folders">
            {item.name && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faMapMarkedAlt} />
                    </ListItemIcon>
                    <ListItemText primary={`Địa chỉ: ${item.name}`} />
                </ListItem>
            )}
            {item.number && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faHouse} />
                    </ListItemIcon>
                    <ListItemText primary={`Số: ${item.number}`} />
                </ListItem>
            )}
            {item.streetName && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faRoad} />
                    </ListItemIcon>
                    <ListItemText primary={`Đường: ${item.streetName}`} />
                </ListItem>
            )}
            {item.District && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faNetworkWired} />
                    </ListItemIcon>
                    <ListItemText primary={`Quận: ${item.District}`} />
                </ListItem>
            )}
            {item.City && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faCity} />
                    </ListItemIcon>
                    <ListItemText primary={`Thành Phố: ${item.City}`} />
                </ListItem>
            )}
            {item.province && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faMap} />
                    </ListItemIcon>
                    <ListItemText primary={`Tỉnh: ${item.province}`} />
                </ListItem>
            )}
            {item.country && (
                <ListItem>
                    <ListItemIcon className="text-green-500">
                        <FontAwesomeIcon icon={faGlobe} />
                    </ListItemIcon>
                    <ListItemText primary={`Country: ${item.country}`} />
                </ListItem>
            )}
        </List>
    )
}