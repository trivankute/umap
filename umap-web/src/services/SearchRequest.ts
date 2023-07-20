import FetchFacade from "./FetchFacade"

export async function saveSearchRequest(data: object) {
    const res = await FetchFacade.post("log", null, data)
    return res
}

export async function getSearchHistory() {
    const res = await FetchFacade.get("log")
    return res
}

export async function deleteSearchHistory(id: string) {
    const res = await FetchFacade.del(`log/${id}`)
    return res
}

export async function deleteAllSearchHistory() {
    const res = await FetchFacade.del("log/all")
    return res
}
