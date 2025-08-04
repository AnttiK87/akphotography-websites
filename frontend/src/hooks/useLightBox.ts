import { useContext } from "react";
import LightBoxContext from "../contexts/LightBoxContext";

const useLightBox = () => {
  const context = useContext(LightBoxContext);
  if (!context) {
    throw new Error("useLightBox must be used within a LightBoxProvider");
  }
  return context;
};

export default useLightBox;
