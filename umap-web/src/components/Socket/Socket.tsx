import { useEffect } from 'react'
// @ts-ignore
import io from 'socket.io-client'
export let socket: any
export default () => {
  useEffect(() => {
    fetch('http://localhost:3000/api/socket').finally(() => {
      // @ts-ignore
      socket = io(undefined, {
        path: '/api/socket_io',
      })

      socket.on('connect', () => {
        console.log('connect')
      })

      socket.on('a user connected', () => {
        console.log('a user connected')
      })

      socket.on('disconnect', () => {
        console.log('disconnect')
      })

    })
  }, []) // Added [] as useEffect filter so it will be executed only once, when component is mounted

  return <></>
}