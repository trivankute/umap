import makeGWCRequest from "../makeGWCRequest.js";

const layerBody = {
    "GeoServerLayer": {
        "id": "LayerGroupInfoImpl--1a6bcbe4:188c234fd72:39cc",
        "enabled": true,
        "inMemoryCached": false,
        "name": "umap:hochiminh-basemap",
        "mimeFormats": ["image/png"],
        "gridSubsets": {
          "gridSubset": {
            "gridSetName": "My_EPSG:4326",
            "extent": {
                "coords": {
                    "double": ["106.33020251575947","10.37213330929971","106.99864790182565","11.112771400843512"]
                }
            },
            "zoomStart": 11,
            "zoomStop": 20
          }
        },
        //"metaWidthHeight": [ 0, 0 ],        
        "expireCache": 0,
        "expireClients": 1000,
        "parameterFilters": {},
        "gutter": 20

    }
}

async function setLayerConfig(layerName : string) {
    const res = await makeGWCRequest(`/layers/${layerName}.json`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        data: layerBody
    })
    console.log(res)
  }
  


export default setLayerConfig