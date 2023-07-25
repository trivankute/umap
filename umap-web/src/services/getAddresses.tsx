export default async function getAddresses(searchValue: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "text": searchValue
  });

  const requestOptions:any = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch("http://localhost:3000/api/map/getAddresses/fromText/", requestOptions)
  .then(response => response.json())
  .then(result => result)
  .catch(error => console.log('error', error));

  console.log("Response: ", response)
  if(response.state === 'success'){
    if(response.searchMode === 'full'){
      return response.data
    }
    else if(response.searchMode === 'street'){
      console.log("Response: ", response)
      return [response]
    }
    else if(response.searchMode === 'ward'){
      return [response]
    }
    else if(response.searchMode === 'district'){
      return [response]
    }
    else if(response.searchMode === 'city'){
      return [response]
    }
    else if(response.searchMode === 'province'){
      return [response]
    }
  }
  else if(response.length>0){
    return response
  }

  return []
}