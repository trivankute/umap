import { memo, useState, useEffect } from "react";
import Heart from "../Heart";
import {heartPointsArray} from '../support'

function HeartsTrajectory() {
    const [arrayOfPoints, setArrayOfPoints] = useState<any>(heartPointsArray)
    // const [arrayOfPoints, setArrayOfPoints] = useState<any>([])
    // useEffect(() => {
    //     function handleClick(e: any) {
    //         setArrayOfPoints(prev=>[...prev, {
    //             x: e.clientX,
    //             y: e.clientY
    //         }])
    //     }
    //     window.addEventListener("click", handleClick)
    //     return () => {
    //         window.removeEventListener("click", handleClick)
    //     }
    // }, [])
    // console.log(arrayOfPoints)
    return (<>
        <div className="fixed right-0 top-0 left-0 flex justify-center items-center" style={{ zIndex: 11000 }}>
            {
                arrayOfPoints.map((item: any, index: number) => {
                    let random = Math.floor(Math.random() * 3) + 1
                    return (
                        <Heart key={index} type={random} action="trajectory" x={item.x} y={item.y} />
                    )
                })
            }
        </div>
    </>);
}

export default memo(HeartsTrajectory);