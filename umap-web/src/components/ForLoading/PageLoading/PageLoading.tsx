import { memo } from "react";
import Loading from "../Loading/Loading";

function PageLoading() {
    return ( <>
        <div className="w-full h-screen flex justify-center items-center bg-pink-300">
            <Loading/>
        </div>
    </> );
}

export default memo(PageLoading);