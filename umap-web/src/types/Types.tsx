export interface SearchBoxProps {
    onSearchDirection: () => void;
}
  
export interface SearchResult {
    place_id: string;
    display_name: string;
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