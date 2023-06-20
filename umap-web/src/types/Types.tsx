export interface SearchBoxProps {
    onSearchDirection: () => void;
}
  
export interface SearchResult {
    place_id: string;
    display_name: string;
}