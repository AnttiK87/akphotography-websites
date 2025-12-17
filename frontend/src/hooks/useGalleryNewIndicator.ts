import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers/store";
import { initializePicturesAllData } from "../reducers/pictureReducer";
import { useAppDispatch } from "./useRedux";

import type { PictureDetails } from "../types/pictureTypes";

const useGalleryNewIndicator = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPictures = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        await dispatch(initializePicturesAllData());
      } catch (error) {
        console.error("error: ", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPictures();
  }, [dispatch]);

  const allPictures = useSelector(
    (state: RootState) => state.pictures.allPictures
  );

  const isNewImage = (image: PictureDetails): boolean => {
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return new Date(image.uploadedAt).getTime() > monthAgo;
  };

  const newImages: PictureDetails[] =
    !isLoading && !isError ? allPictures.filter(isNewImage) : [];

  const viewedImg = localStorage.getItem("viewedImages");

  const viewedIds: number[] = viewedImg ? JSON.parse(viewedImg) : [];

  const viewedSet = new Set(viewedIds);

  const getNewImages = (images: PictureDetails[]): PictureDetails[] => {
    if (!images) return [];
    return images.filter((img) => !viewedSet.has(img.id));
  };

  const getNewImagesByCategory = (
    images: PictureDetails[],
    category: string | undefined
  ): PictureDetails[] => {
    if (!category) return [];
    const newImages = images.filter((img) => img.type === category);
    return newImages.filter((img) => !viewedSet.has(img.id));
  };

  return {
    isLoading,
    isError,
    newImages,
    getNewImages,
    getNewImagesByCategory,
  };
};

export default useGalleryNewIndicator;
