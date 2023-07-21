import React from 'react'
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleUp, faArrowCircleUp, faArrowTurnRight } from '@fortawesome/free-solid-svg-icons';

function DirectionList() {
    const listItems = useAppSelector(state => state.routing.directionInfor)

    return (
      <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <List 
          sx={{ '& .MuiListItem-root:hover': { backgroundColor: 'lightgreen' } }}
        >
          {listItems.map((item: any, index:any) => {
            if (item.direction === 'start') {
              return (
                <ListItem key={item}>
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowAltCircleUp} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. Bắt đầu`} />
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
                <ListItem key={item}>
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowCircleUp} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. Chạy tiếp trên ${item.osm_name}`} />
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
                <ListItem key={item}>
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. Rẽ trái vào ${item.osm_name}`} />
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
                <ListItem key={item}>
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowAltCircleRight} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. Rẽ phải vào ${item.osm_name}`} />
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
                <ListItem key={item}>
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowTurnRight} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. Quay đầu bên trái vào ${item.osm_name}`} />
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
                <ListItem key={item}>
                  <ListItemIcon>
                        <FontAwesomeIcon icon={faArrowTurnRight} />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. Quay đầu bên phải vào ${item.osm_name}`} />
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
                <ListItem key={item}>
                  <ListItemText primary={`${index + 1}. ${item.direction} ${item.osm_name}`} />
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
  