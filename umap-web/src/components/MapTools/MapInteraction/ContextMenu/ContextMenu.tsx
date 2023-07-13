import { memo, useState } from "react";
import ContextMenuItem from "../ContextMenuItem/ContextMenuItem";
import { motion, AnimatePresence } from 'framer-motion'
import { Button, CloseButton } from 'react-bootstrap'


interface ContextMenuProps {
  show: boolean,
  setShow: any,
  setShowFilterMenu: any,
  setInteractMode: any,
  interactMode: 'mainMarkerOn' | 'mainMarkerOff' | 'filter',
  position: { top: number, left: number },
  setPosition: any,
  startPoint: any,
  setStartPoint: any,
  endPoint: any,
  setEndPoint: any,
}

function ContextMenu(props: ContextMenuProps) {
  const closeHandler = ()=>{
    props.setShow(false);
  }

  return (<> 
      {
        props.show &&
        <AnimatePresence >
            <motion.div
              drag
              dragMomentum={false}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100}}
              className={"w-fit h-fit bg-white absolute rounded-tr-md rounded-b-md shadow-xl drop-shadow-xl overflow-hidden"}
              style={{ zIndex: 10001, top: props.position.top, left: props.position.left, originX: 0, originY: 0 }}>
              <div className="w-full h-10 bg-white cursor-grab p-1">
                <button onClick={closeHandler} type="button" className="hover:bg-neutral-200" 
                aria-label="Close" style={{float:'right'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
              <ContextMenuItem setStartPoint={props.setStartPoint} text="Chỉ đường từ đây" />
              {
                props.startPoint !== null &&
                <ContextMenuItem setStartPoint={props.setStartPoint} remove text="Remove start point" />
              }
              <ContextMenuItem setEndPoint={props.setEndPoint} text="Chỉ đường tới đây" />
              {
                props.endPoint !== null &&
                <ContextMenuItem setEndPoint={props.setEndPoint} remove text="Remove end point" />
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
        </AnimatePresence >
      }
  </>);
}

export default memo(ContextMenu);