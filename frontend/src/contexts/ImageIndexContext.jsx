import { createContext, useState } from "react";
import PropTypes from "prop-types";

const ImageIndexContext = createContext();

export const ImageIndexProvider = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    Math.floor(Math.random() * 8) + 1
  );
  return (
    <ImageIndexContext.Provider
      value={{ currentImageIndex, setCurrentImageIndex }}
    >
      {children}
    </ImageIndexContext.Provider>
  );
};

ImageIndexProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ImageIndexContext;
