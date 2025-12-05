import React from "react";
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import uiComponentService from "../services/uiComponents";

interface ImageIndexContextType {
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  images: string[] | undefined;
}

interface ImageIndexProviderProps {
  children: ReactNode;
}

const ImageIndexContext = createContext<ImageIndexContextType | undefined>(
  undefined
);

export const ImageIndexProvider = ({ children }: ImageIndexProviderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [images, setImages] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    async function fetchPictures() {
      const data = await uiComponentService.getHomeBackGround();
      const randomIndex = Math.floor(Math.random() * data.count) + 1;
      setCurrentImageIndex(randomIndex);
      setImages(data.files);
    }

    fetchPictures();
  }, []);

  return (
    <ImageIndexContext.Provider
      value={{ currentImageIndex, setCurrentImageIndex, images }}
    >
      {children}
    </ImageIndexContext.Provider>
  );
};

export default ImageIndexContext;
