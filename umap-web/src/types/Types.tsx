export interface SearchBoxProps {
    onSearchDirection: () => void;
}
  
export interface SearchResult {
    osm_id: string;
    address: string;
    center: number[]
    totalDistance: number
    type: string 
    typeOfShape: string
}

export interface Infor {
    name: string,
    number?: string,
    streetName?: string,
    District?: string,
    City?: string,
    province?: string,
    country?: string
}