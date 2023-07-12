import { ReactNode, createContext, useState, useContext } from 'react'
import { LatLngExpression } from 'leaflet'

type RoutingProps = {
    children: ReactNode
}

type Position = {address?: string, latlng: LatLngExpression} | null

type RoutingContextType = {
    source: Position,
    destination: Position,
    updateSource: (source: Position) => void,
    updateDestination: (destination: Position) => void
    swapOrder: () => void
}


export const RoutingContext = createContext<RoutingContextType | null>(null)

export const useRoutingContext = () => useContext(RoutingContext) as RoutingContextType

const RoutingProvider = ({ children } : RoutingProps) => {
    const [source, setSource] = useState<Position>(null)
    const [destination, setDestination] = useState<Position>(null)

    function updateSource(source: Position) {
        setSource(prev => {
            return source ? {...prev, ...source} : null
        })
    }
    function updateDestination(destination: Position) {
        setDestination(prev => {
            return destination ? {...prev, ...destination} : null
        })        
    }

    function swapOrder() {
        const [reverseSource, reverseDestination] = [destination, source]
        setSource(reverseSource)
        setDestination(reverseDestination)
    }

    return (
        <RoutingContext.Provider value={{source, destination, updateSource, updateDestination, swapOrder}}>
            {children}
        </RoutingContext.Provider>
    )

}

export default RoutingProvider