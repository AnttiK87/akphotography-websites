import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const LightBoxContext = createContext();

export const LightBoxProvider = ({ children }) => {
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    () => Number(sessionStorage.getItem("lightBoxIndex")) || undefined
  );
  const [category, setCategory] = useState(false);

  const openLightBox = (index) => {
    if (index !== undefined) {
      setIsLightBoxOpen(true);
      setCurrentIndex(index);
    }
  };

  const closeLightBox = () => {
    setIsLightBoxOpen(false);
    setCurrentIndex(undefined);
  };

  useEffect(() => {
    if (isLightBoxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLightBoxOpen]);

  return (
    <LightBoxContext.Provider
      value={{
        isLightBoxOpen,
        currentIndex,
        setCurrentIndex,
        openLightBox,
        closeLightBox,
        setIsLightBoxOpen,
        category,
        setCategory,
      }}
    >
      {children}
    </LightBoxContext.Provider>
  );
};

LightBoxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LightBoxContext;
