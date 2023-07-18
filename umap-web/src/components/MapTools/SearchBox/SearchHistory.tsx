import { useState, useEffect } from "react"
import { getSearchHistory, deleteSearchHistory, deleteAllSearchHistory } from "@/services/SearchRequest";
import CloseIcon from '@mui/icons-material/Close';

interface searchHistoryProps {
  updateSearch: (val: string) => void
}

interface Item {
  id: string,
  content: string
}

const SearchHistory = ({ updateSearch} : searchHistoryProps) => {
  const [history, setHistory] = useState<Item[]>([])
  useEffect(() => {
    const displaySearchHistory = async () => {
      const res = await getSearchHistory()
      setHistory(res)
    }

    displaySearchHistory()
  }, [])

  const deleteSearchItem = async (e: any, id: string) => {
    e.stopPropagation()
    await deleteSearchHistory(id)
      .then(() => {
        setHistory(prev => prev.filter(item => item.id !== id))
      })
  }

  if(history.length === 0) return null

  return (
    <ul className='w-full bg-white mt-[20px] rounded-md overflow-hidden h-fit py-0 z-[100000]'>
      {history.map((item, i) => (
        <li 
          key={i} 
          className='flex w-full py-2 pl-6 pr-4 list-none  hover:bg-gray-200 cursor-pointer'
          onClick={() => updateSearch(item.content)}
        >
          <p className='font-semibold'>{item.content}</p>
          <CloseIcon 
            className='text-gray-100 hover:text-red-500 w-[12px] ml-auto'
            onClick={(e) => deleteSearchItem(e, item.id)}
          />
        </li>
      ))}
        <li 
          key={"clear-all"} 
          className='flex py-2 pl-6 pr-4 list-none  hover:bg-gray-200  hover:text-blue-500 cursor-pointer'
          onClick={() => deleteAllSearchHistory()}
        >
          <p className='font-semibold'>Xóa tất cả...</p>
        </li>
    </ul>
  )
}

export default SearchHistory