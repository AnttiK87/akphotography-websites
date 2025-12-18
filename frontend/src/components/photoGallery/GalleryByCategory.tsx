import { useLanguage } from "../../hooks/useLanguage";
import { getPrivacySettings } from "../../utils/readPrivasySettings.js";
import { useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useAnimationLauncher from "../../hooks/useAnimationLauncher";
import useLightBox from "../../hooks/useLightBox";
import useGalleryNewIndicator from "../../hooks/useGalleryNewIndicator";

import { useAppSelector } from "../../hooks/useRedux.js";
import { makeSelectTextsByScreen } from "../../reducers/selectors/uiTexts";
import { getText } from "../../utils/getText";

import Carouselle from "../homeScreen/Carouselle";
import Gallery from "./Gallery";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";
import newBadgeEn from "../../assets/newBadge-en.png";
import newBadgeFin from "../../assets/newBadge-fin.png";

import "./GalleryByCategory.css";

import type { ValidCategory } from "../../types/types";

const GalleryByCategory = () => {
  const GalleryTexts = useAppSelector(makeSelectTextsByScreen("gallery"));

  const { index, category } = useParams();
  const navigate = useNavigate();

  const { newImages, getNewImagesByCategory } = useGalleryNewIndicator();
  const newImagesInCategory = getNewImagesByCategory(newImages, category);
  const isNewImages = newImagesInCategory.length > 0;

  const validateCategory = useCallback((category: unknown): ValidCategory => {
    const validCategories: ValidCategory[] = [
      "monthly",
      "nature",
      "birds",
      "mammals",
      "landscapes",
    ];
    if (
      typeof category === "string" &&
      validCategories.includes(category as ValidCategory)
    ) {
      return category as ValidCategory;
    } else {
      throw new Error("Invalid category provided.");
    }
  }, []);

  const {
    openLightBox,
    closeLightBox,
    currentIndex,
    setCurrentIndex,
    isLightBoxOpen,
    setCategory,
    setInvalidIndex,
    setIsLightBoxOpen,
  } = useLightBox();

  useEffect(() => {
    setCategory(validateCategory(category));
  }, [category, setCategory, validateCategory]);

  const isLightBoxOpening = useRef(false);

  useEffect(() => {
    const parsedIndex = index ? parseInt(index) : undefined;
    if (
      parsedIndex != undefined &&
      parsedIndex != currentIndex &&
      currentIndex === undefined &&
      !isLightBoxOpen &&
      !isLightBoxOpening.current
    ) {
      isLightBoxOpening.current = true;
      setCurrentIndex(parsedIndex);
      openLightBox(parsedIndex);
    }

    if (parsedIndex == null && currentIndex == null) {
      isLightBoxOpening.current = false;
      closeLightBox();
    }

    if (index && parsedIndex && isNaN(parsedIndex)) {
      setInvalidIndex(true);
      setIsLightBoxOpen(true);
    }
  }, [
    index,
    currentIndex,
    isLightBoxOpen,
    isLightBoxOpening,
    openLightBox,
    closeLightBox,
    setCurrentIndex,
    setInvalidIndex,
    setIsLightBoxOpen,
  ]);

  const { language } = useLanguage();
  const { allowStoreViewedImages } = getPrivacySettings();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0);

  const TextByCategory = {
    monthly: {
      headerFi: getText(GalleryTexts, "header_monthly", "fin"),
      headerEn: getText(GalleryTexts, "header_monthly", "en"),
      textContentFi: getText(GalleryTexts, "textContent_monthly", "fin"),
      textContentEn: getText(GalleryTexts, "textContent_monthly", "en"),
    },
    mammals: {
      headerFi: getText(GalleryTexts, "header_mammals", "fin"),
      headerEn: getText(GalleryTexts, "header_mammals", "en"),
      textContentFi: getText(GalleryTexts, "textContent_mammals", "fin"),
      textContentEn: getText(GalleryTexts, "textContent_mammals", "en"),
    },
    nature: {
      headerFi: getText(GalleryTexts, "header_nature", "fin"),
      headerEn: getText(GalleryTexts, "header_nature", "en"),
      textContentFi: getText(GalleryTexts, "textContent_nature", "fin"),
      textContentEn: getText(GalleryTexts, "textContent_nature", "en"),
    },
    landscapes: {
      headerFi: getText(GalleryTexts, "header_landscapes", "fin"),
      headerEn: getText(GalleryTexts, "header_landscapes", "en"),
      textContentFi: getText(GalleryTexts, "textContent_landscapes", "fin"),
      textContentEn: getText(GalleryTexts, "textContent_landscapes", "en"),
    },
    birds: {
      headerFi: getText(GalleryTexts, "header_birds", "fin"),
      headerEn: getText(GalleryTexts, "header_birds", "en"),
      textContentFi: getText(GalleryTexts, "textContent_birds", "fin"),
      textContentEn: getText(GalleryTexts, "textContent_birds", "en"),
    },
  };

  const categorysTextData = TextByCategory[validateCategory(category)];

  useEffect(() => {
    if (!categorysTextData) {
      navigate("/404", { replace: true });
    }
  }, [categorysTextData, navigate]);

  if (!categorysTextData) {
    return null;
  }

  const headerPhotoOfMonth = (
    <h1 className="mainHeaderGallery">
      {language === "fin"
        ? categorysTextData.headerFi
        : categorysTextData.headerEn}
    </h1>
  );

  const textPhotoOfMonth = (
    <p className="textPom">
      {language === "fin"
        ? categorysTextData.textContentFi
        : categorysTextData.textContentEn}
    </p>
  );

  return (
    <div ref={elementRef}>
      <div className="wholeScreenPoM">
        <FootPrints
          toesLeft={toesLeft}
          toesRight={toesRight}
          printCount={19}
          isVisible={isVisible}
          className={"printsGallery2"}
        />

        <div className="grid-containerPoM">
          {isNewImages && allowStoreViewedImages && (
            <img
              className="newBadge"
              src={language === "fin" ? newBadgeFin : newBadgeEn}
              alt="newBadge"
            />
          )}
          <div className={`elementPoM1 ${startAnim ? "fade-in" : ""}`}>
            {headerPhotoOfMonth}
          </div>
          <div className={`elementPoM2 ${startAnim ? "fade-in" : ""}`}>
            {textPhotoOfMonth}
          </div>
          <div className={`elementPoM3 ${startAnim ? "fade-in" : ""}`}>
            <Carouselle category={validateCategory(category)} />
          </div>
        </div>
        <div className="galleryDiv">
          <Gallery category={validateCategory(category)} />
        </div>
      </div>
    </div>
  );
};

export default GalleryByCategory;
