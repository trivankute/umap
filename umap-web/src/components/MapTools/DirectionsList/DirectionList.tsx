import React from 'react'
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { instruction } from '@/utils/getDirectionInstruction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { routeItemBlurred, routeItemHovered } from '@/redux/slices/routingSlice';
import { popupShowed } from '@/redux/slices/popupSlice';
import { faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleUp, faArrowCircleUp, faArrowTurnRight, faTentArrowTurnLeft } from '@fortawesome/free-solid-svg-icons';

function DirectionList() {
    const dispatch = useAppDispatch()
    const listItems = useAppSelector(state => state.routing.directionInfor)

    const invertLatLng = ([lng, lat]: [number, number]) : [number, number] => [lat, lng]

    const hoverAndShowPopup = (id: number, popup: any) => {
      popup.position = invertLatLng(popup.position)
      dispatch(routeItemHovered(id))
      dispatch(popupShowed(popup))
    }
    const blurItem = () => {
      dispatch(routeItemBlurred())
    }


    return (
      <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <List 
          sx={{ '& .MuiListItem-root:hover': { backgroundColor: 'lightgreen', cursor: 'pointer' } }}
        >
          {listItems.map((item: any, index:any) => {
            if (item.direction === 'start') {
              return (
                <ListItem 
                  key={index} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowAltCircleUp} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}m`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              );
            } else if (item.direction === 'straight') {
              return (
                <ListItem 
                  key={index} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >                 
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowCircleUp} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}m`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              )
            }else if (item.direction === 'left') {
              return (
                <ListItem 
                  key={index} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >                  
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}m`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              );
            } else if (item.direction === 'right') {
              return (
                <ListItem 
                  key={index} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >                
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowAltCircleRight} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}m`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              );
            }else if (item.direction === 'u turn left') {
              return (
                <ListItem 
                  key={index} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >                 
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowTurnRight} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}m`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              );
            }else if (item.direction === 'u turn right') {
              return (
                <ListItem 
                  key={index} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >            
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowTurnRight} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}m`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              );
            } else {
              return (
                <ListItem 
                  key={item} 
                  onMouseEnter={() => hoverAndShowPopup(index, {position: item.coors[0], content: `${instruction(item.direction, item.osm_name)}`})}
                  onMouseLeave={() => blurItem()}
                >                
                  <ListItemText primary={`${index + 1}. ${instruction(item.direction, item.osm_name)}`} />
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ListItemText 
                      primary={`${Math.round(item.km*1000)}`} 
                      sx={{
                        opacity: 0.5,
                        fontSize: '10px'
                      }}
                    />
                  </Box>
                </ListItem>
              );
            }
          })}
        </List>
      </Box>
    );
  }
  
  export default DirectionList;
  