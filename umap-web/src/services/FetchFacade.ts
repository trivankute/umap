const FetchFacade = (() => {
    const makeRequest = async (url: string = "", method: string, headers : object | null = null, data : object | null = null) => {
        try {
            const response = await fetch(`${process.env.SERVER_URL}/${url}`,
            {
                method: method,
                credentials: "include",
                headers: {
                    ...headers, 
                    'Content-Type': 'application/json'
                },
                body: data ? JSON.stringify(data) : null

            })
            const responseData = await response.json()
            return responseData
        } catch (error : any) {
            throw new Error(`Request failed: ${error.message}`)     
        }
    }

    const get = (url: string, headers : object | null = null) => makeRequest(url, 'GET', headers)
    const post = (url: string, headers : object | null, data: object) => makeRequest(url, 'POST', headers, data)
    const put = (url: string, headers : object, data: object) => makeRequest(url, 'PUT', headers, data)
    const del = (url: string, headers : object | null = null) => makeRequest(url, 'DELETE', headers)

    return {get, post, put, del}
})();

export default FetchFacade