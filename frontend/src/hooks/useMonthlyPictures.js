// src/hooks/useMonthlyPictures.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeMonthly } from "../reducers/pictureReducer";
import { formatMonthYear } from "../utils/dateUtils";

const useMonthlyPictures = (language) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(initializeMonthly())
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch]);

  const monthlyPictures = useSelector((state) => state.pictures.allPictures);

  const pictures = monthlyPictures.map((item) => ({
    src: item.url,
    width: item.width,
    height: item.height,
    id: item.id,
    title: formatMonthYear(item.month_year, language),
    description: language === "fin" ? item.text.textFi : item.text.textEn,
    uploadedAt: item.uploadedAt,
  }));

  return { isLoading, isError, pictures };
};

export default useMonthlyPictures;
