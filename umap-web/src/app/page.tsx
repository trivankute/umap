'use client'
import React,{useState} from "react";
import SearchBox from "@/components/SearchBox"
import DirectionBox from "@/components/DirectionBox"
import ViewMap from "../../components/map";
import './styles.component.css'

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
