import makeGWCRequest from "../makeGWCRequest.js";

async function getTaskStatus(layerName:string) {
    const res = await makeGWCRequest(`/seed/${layerName}.json`)
    console.log(res)
    
}

export default getTaskStatus