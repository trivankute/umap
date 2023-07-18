'use client'
import React, { useState } from "react";
import SearchBox from "@/components/MapTools/SearchBox/SearchBox"
import DirectionBox from "@/components/MapTools/DirectionBox/DirectionBox"
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/Map/Map"), { ssr: false });
import { AnimatePresence } from "framer-motion";
import { SearchResult } from "@/types/Types";
import { StoreProvider } from "@/redux/provider"

export default function Home() {
  const [showDirectionBox, setShowDirectionBox] = useState(false);

  const handleSearchDirection = () => {
    setShowDirectionBox(true);
  };

  const handleSearchCancel = () => {
    setShowDirectionBox(false);
  };

  return (
    <StoreProvider>
      <div className="relative">
        <div className="absolute" style={{ zIndex: 10000 }}>
          <AnimatePresence mode='wait'>
            {showDirectionBox &&
              <DirectionBox onDirectionCancel={handleSearchCancel} />
            }
          </AnimatePresence>
          <AnimatePresence mode='wait'>
            {!showDirectionBox &&
              <SearchBox onSearchDirection={handleSearchDirection}/>
            }
          </AnimatePresence>
        </div>
        <div className="relative">
          <MapView/>
        </div>
      </div>
    </StoreProvider>
  )
}