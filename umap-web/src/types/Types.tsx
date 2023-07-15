export interface SearchBoxProps {
    onSearchDirection: () => void;
}

export interface SearchResult {
    osm_id?: string;
    address?: string;
    center: any
    totalDistance?: number
    type?: string 
    typeOfShape?: string
    state?: string
    searchMode?: string
    borderLine?: any
}

export interface PopupInfor {
    address: string,
    lng: string,
    lat: string,
    type: string,
    typeOfShape: string
}
