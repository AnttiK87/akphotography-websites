import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { initializePicturesByCategory } from "../reducers/pictureReducer";
import { formatMonthYear } from "../utils/dateUtils";
import { useLanguage } from "./useLanguage";
import { useAppDispatch } from "./useRedux";

import type { Category } from "../types/types";
import type { RootState } from "../reducers/store";
import type {
  GalleryPicture,
  PictureDetails,
  PicturesBasic,
} from "../types/pictureTypes";

const usePicturesByCategory = (category: Category) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { language } = useLanguage();
  const [picturesByCategory, setPicturesByCategory] = useState<
    GalleryPicture[]
  >([]);
  const [currentCategory, setCurrentCategory] = useState<Category>(undefined);
  useEffect(() => {
    if (!category || category === currentCategory) return;

    const fetchPictures = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        await dispatch(initializePicturesByCategory(category));
        setCurrentCategory(category);
      } catch (error) {
        console.error("error: ", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPictures();
  }, [category, currentCategory, dispatch]);

  const allPictures = useSelector(
    (state: RootState) => state.pictures.allPictures
  );
  const monthlyPictures = useSelector(
    (state: RootState) => state.pictures.monthly
  );
  const naturePictures = useSelector(
    (state: RootState) => state.pictures.nature
  );
  const birdiePictures = useSelector(
    (state: RootState) => state.pictures.birds
  );
  const mammalsPictures = useSelector(
    (state: RootState) => state.pictures.mammals
  );
  const landscapesPictures = useSelector(
    (state: RootState) => state.pictures.landscapes
  );

  const picturesToReturn: PicturesBasic[] | PictureDetails[] = (() => {
    if (category === "monthly") {
      return monthlyPictures;
    } else if (category === "nature") {
      return naturePictures;
    } else if (category === "birds") {
      return birdiePictures;
    } else if (category === "mammals") {
      return mammalsPictures;
    } else if (category === "landscapes") {
      return landscapesPictures;
    } else {
      return allPictures;
    }
  })();

  useEffect(() => {
    if (!isLoading) {
      setPicturesByCategory(
        picturesToReturn.map((item) => ({
          src: item.urlThumbnail,
          srcFullRes: item.url,
          width: item.width,
          height: item.height,
          id: item.id,
          uploadedAt: item.uploadedAt,
          title: formatMonthYear(item.monthYear, language),
          keywords: item.keywords,
          description:
            language === "fin"
              ? item.text?.textFi || ""
              : item.text?.textEn || "",
        }))
      );
    }
  }, [picturesToReturn, isLoading, language]);

  return {
    isLoading,
    isError,
    picturesByCategory,
    picturesToReturn,
    setPicturesByCategory,
  };
};

export default usePicturesByCategory;
