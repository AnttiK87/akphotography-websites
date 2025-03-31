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
  const [currentCategory, setCurrentCategory] = useState("");
  //console.log(`loading: ${isLoading}`);
  //console.log(`category: ${category}`);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    if (category && category != currentCategory) {
      dispatch(initializePicturesByCategory(category))
        .then(() => setIsLoading(false), setCurrentCategory(category))
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  }, [dispatch, category, currentCategory]);

  const allPictures = useSelector((state) => state.pictures.allPictures);
  const monthlyPictures = useSelector((state) => state.pictures.monthly);
  const naturePictures = useSelector((state) => state.pictures.nature);
  const birdsPictures = useSelector((state) => state.pictures.birds);
  const mammalsPictures = useSelector((state) => state.pictures.mammals);
  const landscapesPictures = useSelector((state) => state.pictures.landscapes);

  const picturesToReturn = (() => {
    if (category === "monthly") {
      return monthlyPictures;
    } else if (category === "nature") {
      return naturePictures;
    } else if (category === "birds") {
      return birdsPictures;
    } else if (category === "mammals") {
      return mammalsPictures;
    } else if (category === "landscapes") {
      return landscapesPictures;
    } else {
      return allPictures;
    }
  })();

  /*console.log(
    `picturedByCategory length: ${JSON.stringify(
      allPictures.length
    )} and ${JSON.stringify(allPictures)}`
  );*/

  useEffect(() => {
    if (!isLoading) {
      setPicturesByCategory(
        picturesToReturn.map((item) => ({
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
  }, [picturesToReturn, isLoading, category, language]);
  return {
    isLoading,
    isError,
    picturesByCategory,
    picturesToReturn,
    setPicturesByCategory,
  };
};

export default usePicturesByCategory;
