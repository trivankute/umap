export default async function getAddress(lng: any, lat: any){
    const params = new URLSearchParams();
    params.append('lng', lng);
    params.append('lat', lat);

    const url = `http://localhost:3000/api/map/getAddress/fromCoor?${params.toString()}`;

    const response = await fetch(url)
    .then(response => response.json())
    .then(result => result)
    .catch(error => console.log('error', error));

    return response
}