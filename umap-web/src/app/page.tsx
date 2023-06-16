'use client'
import React,{useState} from "react";
import SearchBox from "@/components/SearchBox"
import DirectionBox from "@/components/DirectionBox"

export default function Home() {
  const [showDirectionBox, setShowDirectionBox] = useState(false);

  const handleSearchDirection = () => {
    setShowDirectionBox(true);
  };
  
  const handleSearchCancel = () => {
    setShowDirectionBox(false);
  };
  
  return (
    <main className="">
      {showDirectionBox ? (
        <DirectionBox onDirectionCancel={handleSearchCancel}/>
      ) : (
        <SearchBox onSearchDirection={handleSearchDirection} />
      )}
    </main>
  )
}
