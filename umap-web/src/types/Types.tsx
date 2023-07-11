import { LatLngExpression } from "leaflet";

export interface SearchBoxProps {
    onSearchDirection: () => void;
}
  
export interface SearchResult {
    osm_id: string;
    address: string;
    center: any
    totalDistance: number
    type: string 
    typeOfShape: string
    state?: string
    searchMode?: string
    borderLine?: any
}

export interface SearchAreaResult {
    state: string, 
    searchMode: string,
    address: string,
    center: number[],
    borderLine: number[][]
}

export interface PopupInfor {
    address: string,
    lng: string,
    lat: string,
    type: string,
    typeOfShape: string
}
