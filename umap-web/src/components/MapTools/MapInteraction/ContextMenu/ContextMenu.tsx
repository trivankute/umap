import { memo, useState } from "react";
import ContextMenuItem from "../ContextMenuItem/ContextMenuItem";
import { motion, AnimatePresence } from 'framer-motion'
import Draggable, { DraggableCore } from 'react-draggable';

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

function ContextMenu({startPoint, endPoint, setStartPoint, setEndPoint, setPosition, show, setShow, setInteractMode, setShowFilterMenu, interactMode, position }: ContextMenuProps) {
  const [dragging, setDragging] = useState(false);
  let x:any,y:any;
  const onDrag = (event: any, ui: any) => {
    const { x, y } = ui;
    setPosition({ top: position.top+ y, left: position.left+x });
    // if (event.type === 'mousemove' || event.type === 'touchmove') {
    //   setDragging(true)
    // }

    // if (event.type === 'mouseup' || event.type === 'touchend') {
    //   setTimeout(() => {
    //     setDragging(false);
    //   }, 0);

    // }
  }
  function dragHandlers(e:any){
   //onDrag: onDrag 
    //setTimeout(setPosition({top: e.clientY, left: e.clientX}),100);
    x = e.clientX;
    y = e.clientY;
  };

  function dragEndHandler(){
    setPosition({top:y,left:x});
  }

  return (<>
      {
        show &&
      // <div draggable onDrag={dragHandlers} onDragEnd={dragEndHandler}>
    <AnimatePresence >
        <motion.div
          // transform origin on top left
          drag
          dragMomentum={false}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 100}}
          className={"w-fit h-fit bg-white absolute rounded-tr-md rounded-b-md shadow-xl drop-shadow-xl overflow-hidden"}
          style={{ zIndex: 10001, top: position.top, left: position.left, originX: 0, originY: 0 }}>
          <div className="w-full h-10 bg-pink-200 cursor-grab">Drag here</div>
          <ContextMenuItem setStartPoint={setStartPoint} text="Chỉ đường từ đây" />
          {
            startPoint !== null &&
            <ContextMenuItem setStartPoint={setStartPoint} remove text="Remove start point" />
          }
          <ContextMenuItem setEndPoint={setEndPoint} text="Chỉ đường tới đây" />
          {
            endPoint !== null &&
            <ContextMenuItem setEndPoint={setEndPoint} remove text="Remove end point" />
          }
          {
            interactMode !== 'mainMarkerOff' &&
            <ContextMenuItem setShowFilterMenu={setShowFilterMenu} setShowContextMenu={setShow} setInteractMode={setInteractMode} text="Lọc trong bán kính của MainMarker" modeForMarker="filter" />
          }
          {
            interactMode === 'filter' &&
            <ContextMenuItem setShowContextMenu={setShow} setInteractMode={setInteractMode}
              text="Chuyển sang xem địa chỉ" modeForMarker="click" />
          }
          {
            interactMode === 'mainMarkerOff' && <ContextMenuItem text="Click vào map để xem địa chỉ" />
          }
          {/* </div> */}
        </motion.div>
    </AnimatePresence >
        //</div>
      }
  </>);
}

export default memo(ContextMenu);