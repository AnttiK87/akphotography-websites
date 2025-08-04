import { useContext } from "react";
import ImageIndexContext from "../contexts/ImageIndexContext";

export const useImageIndex = () => {
  const context = useContext(ImageIndexContext);
  if (!context) {
    throw new Error("useImageIndex must be used within a ImageIndexProvider");
  }
  return context;
};
