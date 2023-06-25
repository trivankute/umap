import makeGWCRequest from "../makeGWCRequest.js";

// kill pending or running seed/truncate/reseed thread
async function killTask(layerName:string) {
    const res = await makeGWCRequest(`/seed/${layerName}`, {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        params: {
          "kill_all" : "all"
        }
    })
    console.log(JSON.stringify(res))
}

export default killTask