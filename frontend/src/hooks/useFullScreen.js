import { useEffect, useState } from "react";

const useFullScreen = (isMobile) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      enterFullscreen();
    }
  }, [isMobile]);

  // Mene koko näyttöön
  const enterFullscreen = () => {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      // Safari
      document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      // IE
      document.body.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  // Poistu koko näytöstä
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  return { isFullScreen, enterFullscreen, exitFullscreen };
};

export default useFullScreen;
