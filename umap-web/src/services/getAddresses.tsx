export default async function getAddresses(searchValue: string) {
  let addresses: any = []

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "text": searchValue
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch("http://localhost:3000/api/map/getAddresses/fromText/", requestOptions)
  .then(response => response.json())
  .then(result => result)
  .catch(error => console.log('error', error));

  if(response.state === 'success'){
    if(response.searchMode === 'full'){
      console.log(response.data)
      return response.data
    }
    if(response.searchMode === 'street'){
      console.log(response)
      return [response]
    }
    if(response.searchMode === 'ward'){
      return [response]
    }
    if(response.searchMode === 'district'){
      return [response]
    }
  }

  return []
}