import useSWR from "swr"

export default function useCancelableSWR (key:any, opts:any) {
    const controller = new AbortController()
    const fetcher = async (...args:[any]) => {
        return fetch(...args).then(res => res.json())
    };
    // @ts-ignore
    return [useSWR(key, url=> fetcher(url, { signal: controller.signal }), opts), controller]
  }
  