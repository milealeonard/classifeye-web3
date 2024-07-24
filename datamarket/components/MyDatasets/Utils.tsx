import React from "react";
import { Dataset } from "@/constants";

interface WindowSize {
    width: number;
    height: number;
}



const useWindowSize = () : WindowSize  => {
    const [windowSize, setWindowSize] = React.useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    })

    React.useEffect(() => {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
    
        window.addEventListener('resize', handleResize);
    
        // Initial call to set the state with the current window size
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);


    return windowSize;
}

/* Toggle Buttons */





/* Dataset utils */



export const Utils = {
    useWindowSize
};



