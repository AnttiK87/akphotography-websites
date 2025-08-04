import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface ImageIndexContextType {
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

interface ImageIndexProviderProps {
  children: ReactNode;
}

const ImageIndexContext = createContext<ImageIndexContextType | undefined>(
  undefined
);

export const ImageIndexProvider = ({ children }: ImageIndexProviderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(
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

export default ImageIndexContext;
