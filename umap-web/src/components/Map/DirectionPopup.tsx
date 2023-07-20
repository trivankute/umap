import { useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Popup } from 'react-leaflet'
import { LatLngExpression } from "leaflet";

const DirectionPopup = () => {
    const popupCoords = useAppSelector(state => state.routing.popupCoors)
    console.log('coors: ' ,popupCoords)
    const InstructionPopup = useCallback(() => {
      if(!popupCoords) return null
      return <Popup position={{lat: popupCoords.position?.[0], lng: popupCoords.position?.[1] } as LatLngExpression}>
        {popupCoords.content}
      </Popup>
    }, [popupCoords])
    return <InstructionPopup />
}

export default DirectionPopup