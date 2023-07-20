import React from 'react'
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { instruction } from '@/utils/getDirectionInstruction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { routeItemBlurred, routeItemHovered, routeClicked } from '@/redux/slices/routingSlice';
import { faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleUp, faArrowCircleUp, faArrowTurnRight, faTentArrowTurnLeft } from '@fortawesome/free-solid-svg-icons';

function DirectionList() {
    const dispatch = useAppDispatch()
    const listItems = useAppSelector(state => state.routing.directionInfor)
    const number = [1,2,3,4,5,6,7,8,9]
    const distance = number.reduce((prev: any, curr: any)=>prev+curr, 0)

    const invertLatLng = ([lng, lat]: [number, number]) : [number, number] => [lat, lng]

    const hoverItem = (id: number) => {
      dispatch(routeItemHovered(id))
    }
    const blurItem = () => {
      dispatch(routeItemBlurred())
    }

    const showPopup = (coors: [number, number], content: string) => {
      dispatch((routeClicked({position: invertLatLng(coors), content})))
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
                  key={item} 
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
                  key={item} 
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
                  key={item} 
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
                  key={item} 
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
                  key={item} 
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
                  key={item} 
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
                  onClick={() => showPopup(item.coors[0], item.osm_name)}
                  onMouseEnter={() => hoverItem(index)}
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
  