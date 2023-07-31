import { memo } from "react";
import Heart from "../Heart";

function HeartsVertical({ size }: { size: number }) {
    return (<>
        <div className="fixed right-0 bottom-0 left-0 flex justify-center items-center" style={{ zIndex: 11000 }}>
            {
                Array.from(Array(size).keys()).map((item, index) => {
                    let random = Math.floor(Math.random() * 3) + 1
                    return (
                        <Heart key={index} type={random} action="vertical"/>
                    )
                })
            }
        </div>
    </>);
}

export default memo(HeartsVertical);