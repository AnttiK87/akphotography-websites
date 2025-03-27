import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializePicturesByCategory } from "../reducers/pictureReducer";
import { formatMonthYear } from "../utils/dateUtils";
import { useLanguage } from "./useLanguage";

const usePicturesByCategory = (category) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { language } = useLanguage();
  const [picturesByCategory, setPicturesByCategory] = useState([]);

  //console.log(`loading: ${isLoading}`);
  //console.log(`category: ${category}`);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    if (category) {
      dispatch(initializePicturesByCategory(category))
        .then(() => setIsLoading(false))
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  }, [dispatch, category]);

  const allPictures = useSelector((state) => state.pictures.allPictures);

  /*console.log(
    `picturedByCategory length: ${JSON.stringify(
      allPictures.length
    )} and ${JSON.stringify(allPictures)}`
  );*/

  useEffect(() => {
    if (!isLoading) {
      setPicturesByCategory(
        allPictures.map((item) => ({
          src: item.url,
          width: item.width,
          height: item.height,
          id: item.id,
          uploadedAt: item.uploadedAt,
          title: formatMonthYear(item.month_year, language),
          keywords: item.keywords,
          description:
            language === "fin"
              ? item.text?.textFi || ""
              : item.text?.textEn || "",
        }))
      );
    }
  }, [allPictures, isLoading, category, language]);
  return {
    isLoading,
    isError,
    picturesByCategory,
    allPictures,
    setPicturesByCategory,
  };
};

export default usePicturesByCategory;
