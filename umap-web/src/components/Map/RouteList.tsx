import { Polyline } from 'react-leaflet'
import { useAppSelector } from '@/redux/hooks'

const pathStyle = {
    normal: {
      color: 'green',
      opacity: 0.8,
      weight: 5
    },
    hover: {
      color: 'yellow',
      weight: 5
    }
  }
  

const RouteList = () => {
    const directionsInfor = useAppSelector(state => state.routing.directionInfor)
    const direction = directionsInfor ? directionsInfor.map(
      (item: any)=> {
        const invertLatLng = ([lng, lat]: [number, number]) => [lat, lng]
        const pathPositions = [item.coors.map((position: any)=> invertLatLng(position))]
        return <Polyline key={item.osm_id} pathOptions={item.hovered ? pathStyle.hover : pathStyle.normal} positions={pathPositions} />
      }
    ):null
    if(!directionsInfor) return null
    return (
        <>
        {directionsInfor.map((item: any)=> {
            const invertLatLng = ([lng, lat]: [number, number]) => [lat, lng]
            const pathPositions = [item.coors.map((position: any)=> invertLatLng(position))]
            return (
            <Polyline 
                key={item.osm_id} 
                pathOptions={item.hovered ? pathStyle.hover : pathStyle.normal} 
                positions={pathPositions} 
            />
            )
        })}
        </>
    )
}

export default RouteList