import { useEffect, useState } from "react"
import { useMapEvents } from "react-leaflet"
let timeBeforeClear = 2000
export default function Event() {
  const [readyToSave, setReadyToSave] = useState(false)
  const [event, setEvent] = useState<any>(null)
  useEffect(() => {
    if (readyToSave) {
      let saveFunction = setTimeout(() => {
        fetch("http://localhost:3000/api/session/", {
          method: 'POST',
          body: JSON.stringify({
            'center': event.target.getCenter(),
            'zoom': event.target.getZoom()
          })
        })
      }, timeBeforeClear)
      return () => {
        clearTimeout(saveFunction)
      }
    }
  }, [readyToSave])
  useMapEvents({
    moveend(event) {
      setReadyToSave(true)
      setEvent(event)
    },
    zoomend(event) {
      setReadyToSave(true)
      setEvent(event)
    },
    movestart(event) {
      setReadyToSave(false)
      setEvent(null)
    },
    zoomstart(event) {
      setReadyToSave(false)
      setEvent(null)
    },
  })
  return null
}