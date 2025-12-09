import React from "react";
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import uiComponentService from "../services/uiComponents";

interface ImageIndexContextType {
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  images: string[] | undefined;
  setImages: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

interface ImageIndexProviderProps {
  children: ReactNode;
  path: string | undefined;
}

const ImageIndexContext = createContext<ImageIndexContextType | undefined>(
  undefined
);

export const ImageIndexProvider = ({
  children,
  path,
}: ImageIndexProviderProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [images, setImages] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    async function fetchPictures() {
      if (path === undefined) return;
      const data = await uiComponentService.getPictures(path);
      const randomIndex = Math.floor(Math.random() * (data.count - 1));
      setCurrentImageIndex(randomIndex);
      setImages(data.files);
    }

    fetchPictures();
  }, [path]);

  return (
    <ImageIndexContext.Provider
      value={{ currentImageIndex, setCurrentImageIndex, images, setImages }}
    >
      {children}
    </ImageIndexContext.Provider>
  );
};

export default ImageIndexContext;
