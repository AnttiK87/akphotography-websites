import React from "react";
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import uiComponentService from "../services/uiComponents";

interface ImageIndexContextType {
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  images: string[] | undefined;
  src: string;
  loading: boolean;
  isImageError: boolean;
  setPath: React.Dispatch<React.SetStateAction<string>>;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isImageError, setIsImageError] = useState(false);
  const [path, setPath] = useState<string>("");
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    async function fetchPictures() {
      try {
        const data = await uiComponentService.getPictures(path);
        const randomIndex = Math.floor(Math.random() * (data.count - 1));
        setCurrentImageIndex(randomIndex);
        setImages(data.files);
        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        setIsImageError(true);
        return;
      }
    }

    fetchPictures();
  }, [path]);

  useEffect(() => {
    if (loading) return;
    if (!images || images.length === 0) return;

    setSrc(`../../../images/${path}/${images[currentImageIndex]}`);
  }, [loading, images, path, currentImageIndex]);

  return (
    <ImageIndexContext.Provider
      value={{
        currentImageIndex,
        setCurrentImageIndex,
        images,
        src,
        loading,
        setPath,
        isImageError,
      }}
    >
      {children}
    </ImageIndexContext.Provider>
  );
};

export default ImageIndexContext;
