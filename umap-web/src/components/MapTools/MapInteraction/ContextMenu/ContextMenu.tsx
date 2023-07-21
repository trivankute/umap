import { memo, useCallback, useEffect, useState } from "react";
import ContextMenuItem from "../ContextMenuItem/ContextMenuItem";
import { motion } from 'framer-motion'
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDestination, setDirectionInfor, setSource } from "@/redux/slices/routingSlice";
import { LoadingForSearchBox } from "../../SearchBox/SearchBox";
import { setStateMenu } from "@/redux/slices/loadingSlice";

interface ContextMenuProps {
  show: boolean,
  setShow: any,
  setShowFilterMenu: any,
  setInteractMode: any,
  interactMode: 'mainMarkerOn' | 'mainMarkerOff' | 'filter',
  position: { top: number, left: number },
  setPosition: any,
}

function ContextMenu(props: ContextMenuProps) {
  
  const [loading, setLoading] = useState<null|'start'|'end'>(null)
  const { source, destination } = useAppSelector(state => state.routing)
  const stateMenu = useAppSelector(state => state.loading.stateMenu)
  
  const dispatch = useAppDispatch()
  const closeHandler = () => {
    props.setShow(false);
    // if(loading!=null){
    //   dispatch(setStateMenu(null))
    // }
  }
  
  const handleStartpointSignal = useCallback(() => {
    dispatch(setSource("readyToSet"))
  }, [])
  const handleEndpointSignal = useCallback(() => {
    dispatch(setDestination("readyToSet"))
  }, [])
  const handleRemoveStartpoint = useCallback(() => {
    dispatch(setSource(null))
    dispatch(setDirectionInfor(null))
  }, [])
  const handleRemoveEndpoint = useCallback(() => {
    dispatch(setDestination(null))
    dispatch(setDirectionInfor(null))
  }, [])

  useEffect(()=>{
    setLoading(stateMenu)
  }, [stateMenu])

  return (<>
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={"w-fit h-fit bg-white absolute rounded-tr-md rounded-b-md shadow-xl drop-shadow-xl overflow-hidden"}
      style={{ zIndex: 10001, top: props.position.top, left: props.position.left, originX: 0, originY: 0 }}>
      <Draggable onDrag={(event: any, ui: any) => {
        const { x, y } = ui;
        props.setPosition({ top: props.position.top + y, left: props.position.left + x })
      }}>
        <div className="w-full h-10 p-1  cursor-move bg-white">
          <button onClick={closeHandler} type="button" className="hover:bg-neutral-200"
            aria-label="Close" style={{ float: 'right' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>
      </Draggable>
      {
        loading!=='start'
        ?
        <ContextMenuItem setStartPoint={handleStartpointSignal} text="Chỉ đường từ đây" />
        :
        <LoadingForSearchBox/>
      }
      {
        source !== null &&
        <ContextMenuItem setStartPoint={handleRemoveStartpoint} remove text="Remove start point" />
      }
      {
        loading!=='end'
        ?
        <ContextMenuItem setEndPoint={handleEndpointSignal} text="Chỉ đường tới đây" />
        :
        <LoadingForSearchBox/>
      }
      {
        destination !== null &&
        <ContextMenuItem setEndPoint={handleRemoveEndpoint} remove text="Remove end point" />
      }
      {
        props.interactMode !== 'mainMarkerOff' &&
        <ContextMenuItem setShowFilterMenu={props.setShowFilterMenu}
          setShowContextMenu={props.setShow} setInteractMode={props.setInteractMode}
          text="Lọc trong bán kính của MainMarker" modeForMarker="filter"
        />
      }
      {
        props.interactMode === 'filter' &&
        <ContextMenuItem setShowContextMenu={props.setShow} setInteractMode={props.setInteractMode}
          text="Chuyển sang xem địa chỉ" modeForMarker="click" />
      }
      {
        props.interactMode === 'mainMarkerOff' && <ContextMenuItem text="Click vào map để xem địa chỉ" />
      }
    </motion.div>
  </>);
}

export default memo(ContextMenu);