import { memo, useState } from "react";
import ContextMenuItem from "../ContextMenuItem/ContextMenuItem";
import { motion, AnimatePresence } from 'framer-motion'

interface ContextMenuProps {
  show: boolean,
  setShow: any,
  setShowFilterMenu:any,
  setInteractMode: any,
  interactMode: 'click' | 'filter' | 'none',
  position: { top: number, left: number }
}

function ContextMenu({ show, setShow, setInteractMode, setShowFilterMenu, interactMode, position }: ContextMenuProps) {
  return (<>
    <AnimatePresence>
      {
        show &&
        <motion.div
          // transform origin on top left
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={"w-fit h-fit bg-white absolute rounded-md shadow-xl drop-shadow-xl overflow-hidden"}
          style={{ zIndex: 10001, top: position.top, left: position.left, originX: 0, originY: 0 }}>
          <ContextMenuItem disabled text="Chỉ đường từ Marker này" />
          <ContextMenuItem disabled text="Chỉ đường tới Marker này" />
          {
            interactMode !== 'none' &&
            <ContextMenuItem setShowFilterMenu={setShowFilterMenu} setShowContextMenu={setShow} setInteractMode={setInteractMode} text="Lọc trong bán kính" modeForMarker="filter" />
          }
          {
            interactMode !== 'click' && interactMode !== 'none' &&
              <ContextMenuItem setShowContextMenu={setShow} setInteractMode={setInteractMode}
                text="Chuyển sang xem địa chỉ" modeForMarker="click" />
          }
          {
            interactMode === 'none' && <ContextMenuItem text="Click vào map để xem địa chỉ" />
          }
        </motion.div>
      }
    </AnimatePresence>
  </>);
}

export default memo(ContextMenu);