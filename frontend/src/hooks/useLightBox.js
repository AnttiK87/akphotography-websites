import { useContext } from "react";
import LightBoxContext from "../contexts/LightBoxContext";

const useLightBox = () => {
  const {
    isLightBoxOpen,
    currentIndex,
    setCurrentIndex,
    openLightBox,
    closeLightBox,
    setIsLightBoxOpen,
    category,
    setCategory,
  } = useContext(LightBoxContext);

  return {
    openLightBox,
    closeLightBox,
    currentIndex,
    setCurrentIndex,
    isLightBoxOpen,
    setIsLightBoxOpen,
    category,
    setCategory,
  };
};

export default useLightBox;
