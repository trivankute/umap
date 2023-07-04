import { useMapEvents } from "react-leaflet"
export default function Event() {
    useMapEvents({
        moveend(event){
        fetch("http://localhost:3000/api/session/", {
        method: 'POST',
        body: JSON.stringify({
          'center': event.target.getCenter(),
          'zoom': event.target.getZoom()
        })
      })
      }
    })
    return null
  }