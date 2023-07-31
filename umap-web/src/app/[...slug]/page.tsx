"use client"
import { memo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useDispatch } from "react-redux";
import { turnOnSpecial } from "@/redux/slices/specialSlice";

function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    useEffect(() => {
        if(pathname?.includes('hxldeptrai'))
        {
            dispatch(turnOnSpecial())
        }
        // Always do navigations after the first render
        router.push('/')
    }, [])
  
    // This component doesn't render anything, as it's used for redirection.
    return null
}

export default memo(Page);