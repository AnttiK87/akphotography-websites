import { useContext } from "react";
import ImageIndexContext from "../contexts/ImageIndexContext";

export const useImageIndex = () => useContext(ImageIndexContext);
