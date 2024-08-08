import React from "react";
import { WindowSize } from "@/constants";

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Initial call to set the state with the current window size
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};
