export default function FilterMenuItem(props:any){
    return <>
        <div className="flex items-center">
            <input onChange={(e: any) => {
                props.setType(e.target.value)
            }} checked={props.type === props.amenity} id={props.amenity} type="radio" value={props.amenity} name="filter" 
            className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"></input>
            <label htmlFor="none" className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500 capitalize">
                {props.amenity}
            </label>
        </div>
    </>
}