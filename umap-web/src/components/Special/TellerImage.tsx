import { memo } from "react";
import Image from 'next/image'
import { motion } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import { turnOffTeller } from "@/redux/slices/specialSlice";
import BoxTeller from "./BoxTeller";

function TellerImage() {
    const dispatch = useAppDispatch()
    return (<>
        <motion.div
            // flow up
            initial={{ x: 0, y: 0, opacity: 0.2 }}
            animate={{ x: 70, y: "-20%", opacity: 1 }}
            exit={{ x: 0, y: 0, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
                zIndex: 11000,
                position: "absolute",
                bottom: 0,
                left: 0
            }}
            className="drop-shadow-lg w-fit flex justify-between"
        >
            <Image
                src="/special/pig.png"
                width="200"
                height="200"
                alt="Picture of the author"
                style={{
                    background: "transparent",
                }}
                className="border-2 border-pink-600 hover:brightness-90 cursor-pointer"
                onClick={() => {
                    dispatch(turnOffTeller())
                }}
            />
            <BoxTeller/>
        </motion.div>
    </>);
}

export default memo(TellerImage);