import axios from 'axios';
import gwcConfig from '../../gwcConfig.json' assert {type: 'json'};

const apiInstance = axios.create({
    baseURL: gwcConfig.baseUrl,
    auth: {
        username: gwcConfig.user,
        password: gwcConfig.password
    }
})

async function makeGWCRequest(url : string, data : object = {}) {
    try {
        const response = await apiInstance(url, data)
        return response.data
    } catch(error) {
        console.log(error)
    }
}

export default makeGWCRequest