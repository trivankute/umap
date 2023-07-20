import { memo } from "react";
import clsx from "clsx";

interface ContextMenuItemProps {
    text: string,
    setInteractMode?: any,
    modeForMarker?: 'filter' | 'click',
    setShowContextMenu?: any,
    disabled?: boolean,
    setShowFilterMenu?:any,
    setStartPoint?:any,
    setEndPoint?:any,
    remove?:boolean,
}
function ContextMenuItem({ remove,setStartPoint, setEndPoint, setShowFilterMenu, text, setInteractMode, modeForMarker, setShowContextMenu, disabled }: ContextMenuItemProps) {

    const handleOnClick = ()=>{
        if(setInteractMode&&modeForMarker){
            setInteractMode(modeForMarker)
        }
        if(setShowContextMenu){
            setShowContextMenu(false)
        }
        if(setShowFilterMenu){
            setShowFilterMenu(true)
        }
        if(setStartPoint){
            setStartPoint()
        }
        if(setEndPoint){
            setEndPoint()
        }
    }
    return ( <>
        <div onClick={handleOnClick} className={clsx("w-full h-8 p-2 text-sm hover:bg-neutral-200 flex items-center", {
            "text-gray-400 bg-gray-100 cursor-not-allowed": disabled,
            "text-black hover:text-gray-400 cursor-pointer ": !disabled
        })}>
            {text}
        </div>
    </> );
}

export default memo(ContextMenuItem)