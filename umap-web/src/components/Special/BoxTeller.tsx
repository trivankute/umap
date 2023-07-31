import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { turnOffTeller, turnOnEventBeginning } from "@/redux/slices/specialSlice";
import { memo } from "react";

function BoxTeller() {
    const paragraph = useAppSelector(state => state.special.paragraph)
    const teller = useAppSelector(state => state.special.teller)
    const dispatch = useAppDispatch()
    return ( <>
        {
            paragraph&&
            <div className="max-w-[800px] h-fit rounded-xl drop-shadow-md bg-white p-2 m-2 mt-0" style={{whiteSpace: "pre-line"}}>
                <p className="font-semibold mb-2">Big Pig</p>
                {
                paragraph.map((item:string, index:number)=>{
                    return decodeURIComponent(item)+"\n"
                })
                }
                <div className="w-full mt-2 flex justify-end text-blue-500 hover:text-blue-800 cursor-pointer capitalize">
                    {
                        // @ts-ignore
                        teller==="A Lộc Đẹp Zoai"
                        &&
                        <span onClick={()=>{
                            dispatch(turnOffTeller())
                            dispatch(turnOnEventBeginning())
                        }}>
                            End of intern
                        </span>
                    }
                </div>
            </div>
        }
    </> );
}

export default memo(BoxTeller);