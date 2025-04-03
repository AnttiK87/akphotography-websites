import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
          navigator.maxTouchPoints > 0
      );
    };

    checkMobile();
  }, []);

  return isMobile;
};

export default useIsMobile;
