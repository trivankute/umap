import { SearchResult } from "@/types/Types";

export default async function getDirection(source: SearchResult, destination: SearchResult, mode: string){
    const params = new URLSearchParams();
    params.append('lng1', source.center[1]);
    params.append('lat1', source.center[0]);
    params.append('lng2', destination.center[1]);
    params.append('lat2', destination.center[0]);
    params.append('mode', mode);

    const url = `http://localhost:3000/api/routing/?${params.toString()}`;

    const response = await fetch(url)
    .then(response => response.json())
    .then(result => result)
    .catch(error => console.log('error', error));
    console.log("response",response)
    
    return response
}