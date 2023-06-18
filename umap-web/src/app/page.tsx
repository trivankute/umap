'use client'
import React,{useState} from "react";
import SearchBox from "@/components/MapTools/SearchBox/SearchBox"
import DirectionBox from "@/components/MapTools/DirectionBox/DirectionBox"
import './styles.component.css'
import ViewMap from "@/components/Map/Map";

export default function Home() {
  const [showDirectionBox, setShowDirectionBox] = useState(false);

  const handleSearchDirection = () => {
    setShowDirectionBox(true);
  };
  
  const handleSearchCancel = () => {
    setShowDirectionBox(false);
  };
  
  return (
    <div className="relative">
      <div className="absolute" style={{zIndex:10000}}>
        {showDirectionBox ? (
          <DirectionBox onDirectionCancel={handleSearchCancel}/>
        ) : (
          <SearchBox onSearchDirection={handleSearchDirection} />
        )}
      </div>
      <div className="relative">
        <ViewMap/>
      </div>
    </div>
  )
}
