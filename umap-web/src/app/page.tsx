'use client'
import React, { useState, useEffect } from "react";
import SearchBox from "@/components/MapTools/SearchBox/SearchBox"
import DirectionBox from "@/components/MapTools/DirectionBox/DirectionBox"
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/Map/Map"), { ssr: false });
import { AnimatePresence } from "framer-motion";
import ContextMenu from "@/components/MapTools/MapInteraction/ContextMenu/ContextMenu";
import FilterMenu from "@/components/MapTools/MapInteraction/FilterMenu/FilterMenu";

export default function Home({ views }: { views: number }) {
  const [showDirectionBox, setShowDirectionBox] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const [interactMode, setInteractMode] = useState<'click' | 'filter' | 'none'>('none')

  const MapviewProps = {
    interactMode,
    setShowContextMenu,
    setInteractMode,
    setShowFilterMenu,
  }

  const ContextMenuProps = {
    show: showContextMenu,
    setShow: setShowContextMenu,
    setShowFilterMenu,
    setInteractMode,
    interactMode,
    position: menuPosition
  }

  const FilterMenuProps = {
    show: showFilterMenu,
    setShow: setShowFilterMenu,
    setInteractMode,
    interactMode,
    position: menuPosition
  }

  const handleSearchDirection = () => {
    setShowDirectionBox(true);
  };

  const handleSearchCancel = () => {
    setShowDirectionBox(false);
  };


  useEffect(() => {
    // right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setMenuPosition({ top: e.clientY, left: e.clientX });
      setShowContextMenu(true);
      setShowFilterMenu(false);
    }
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    }
  }, [])

  return (
    <div className="relative">
      <div className="absolute" style={{ zIndex: 10000 }}>
        <AnimatePresence mode='wait'>
          {showDirectionBox &&
            <DirectionBox onDirectionCancel={handleSearchCancel} />
          }
        </AnimatePresence>
        <AnimatePresence mode='wait'>
          {!showDirectionBox &&
            <SearchBox onSearchDirection={handleSearchDirection} />
          }
        </AnimatePresence>
      </div>
      <div className="relative">
        <MapView {...MapviewProps} />
        <ContextMenu {...ContextMenuProps} />
        <FilterMenu {...FilterMenuProps} />
      </div>
    </div>
  )
}