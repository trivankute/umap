import makeGWCRequest from "../makeGWCRequest.js";

async function getLayerConfig(layerName : string) {
    const res = await makeGWCRequest(`/layers/${layerName}`)
    console.log(JSON.stringify(res))
  }
  


export default getLayerConfig