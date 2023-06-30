import makeGWCRequest from "../makeGWCRequest.js";


const seedRequestBody = {
    "seedRequest": {
        "name":"umap:hochiminh-basemap",
        "bounds": {"coords":{ "double":["106.33020251575947","10.37213330929971","106.99864790182565","11.112771400843512"]}},
        "srs": {"number": 4326},
        "zoomStart": 11,
        "zoomStop": 19,
        "format": "image/png",
        "type": "seed",
        "threadCount":  4      
    }
}

async function seedLayer(layerName:string) {
    const res = await makeGWCRequest(`/seed/${layerName}.json`, {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        data: seedRequestBody
    })
    console.log(JSON.stringify(res))
}

export default seedLayer