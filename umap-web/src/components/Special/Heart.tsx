import { memo } from "react";
import Image from 'next/image'
import { motion } from "framer-motion";
import clsx from "clsx";

const href = {
    heart1: "/special/heart1.png",
    heart2: "/special/heart2.png",
    balloon: "/special/balloon.png",
}

function Heart({ type, action, x, y }: { type: number, action: "vertical" | "trajectory", x?: number, y?: number }) {
    let randomTop = Math.floor(Math.random() * 100) + 1 + "%"
    let randomLeft
    if (action === "vertical")
        randomLeft = Math.floor(Math.random() * 100) + 1 + "%"
    else
        randomLeft = Math.floor(Math.random() * window.innerWidth) + 1
    let randomDuration = Math.floor(Math.random() * 8) + 5
    let randomX = Math.floor(Math.random() * 200) + 1
    let randomEffect = Math.floor(Math.random() * 2) + 1
    return (<>
        <motion.div
            // flow up
            initial={action === "vertical" ? { y: 0, x: 0 } : { x: 0, y: 0 }}
            // @ts-ignore
            animate={action === "vertical" ? { y: -1000, x: randomX } : { x: (x - randomLeft), y: y }}
            transition={action === "vertical" ? { duration: randomDuration, ease: "easeInOut" } : { duration: 7, ease: "easeInOut" }}
            style={{
                zIndex: 11000,
                position: "absolute",
                top: action === "vertical" ? randomTop : 0,
                left: randomLeft
            }}
        >
            <Image
                src={
                    (type === 1 ? href.heart1 : type === 2 ? href.heart2 : href.balloon)
                } width={action === "vertical" ? "100" : "40"} height={action === "vertical" ? "100" : "40"} alt="Picture of the author" style={{
                    transform: "translate(-50%,-50%)",
                    background: "transparent",
                }}
                className={clsx("hover:border-blue-600 cursor-pointer",
                    {
                        "animate-bounce": action === "vertical" ? randomEffect === 1 : true,
                        "animate-pulse": action === "vertical" ? randomEffect === 2 : false,
                    })}
            />
        </motion.div>
    </>);
}

export default memo(Heart);