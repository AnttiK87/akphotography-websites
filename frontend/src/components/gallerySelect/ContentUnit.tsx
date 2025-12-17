import { useState, useEffect } from "react";
import pictureService from "../../services/pictures";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage.js";

import useAnimationLauncher from "../../hooks/useAnimationLauncher.js";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import type { Category } from "../../types/types";
import type { PicturesByCategoryResponse } from "../../types/pictureTypes";

import "./ContentUnit.css";

type ContentUnitProps = {
  category: {
    imgClass: Category;
    path: string;
    src: string;
    headerFi: string | undefined;
    headerEn: string | undefined;
    textContentFi: string | undefined;
    textContentEn: string | undefined;
  };
  index: number;
  length: number;
};

const ContentUnit = ({ category, index, length }: ContentUnitProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [latestPictures, setLatestPictures] = useState<
    PicturesByCategoryResponse | undefined
  >(undefined);

  useEffect(() => {
    setIsLoading(true);

    async function fetchPictures() {
      try {
        const pictures = await pictureService.getCategoryLatest(
          category.imgClass
        );
        setLatestPictures(pictures);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPictures();
  }, [category.imgClass]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [startFade, setStartFade] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const duration = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!latestPictures || latestPictures.length === 1) return;
      if (startFade) {
        setCurrentImageIndex((prev) =>
          prev === latestPictures?.length - 2
            ? 0
            : prev === latestPictures?.length - 1
            ? 1
            : prev + 2
        );
      } else {
        setNextImageIndex(
          currentImageIndex >= latestPictures?.length - 1
            ? 0
            : currentImageIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, setCurrentImageIndex, startFade, latestPictures]);

  useEffect(() => {
    if (!latestPictures || latestPictures.length === 1) return;
    const interval = setInterval(() => {
      setStartFade((prev) => !prev);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, latestPictures]);

  useEffect(() => {
    if (!latestPictures || latestPictures.length < 2) return;

    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startFade, latestPictures]);

  const imgPlaceholder = isLoading ? (
    language === "fin" ? (
      "ladataan..."
    ) : (
      "loading..."
    )
  ) : isError ? (
    language === "fin" ? (
      "Virhe ladattaessa kuvia!"
    ) : (
      "Error while loaging pictures!"
    )
  ) : !latestPictures || latestPictures.length === 0 ? (
    language === "fin" ? (
      "Kategoriassa ei ole kuvia!"
    ) : (
      "No pictures in this gategory!"
    )
  ) : (
    <div className={`pictureStack ${index % 2 === 1 ? "reverse" : ""}`}>
      <img
        className={`imgPhotos ${
          isTransitioning && startFade
            ? "fade-out"
            : !isTransitioning && startFade
            ? "fade-in"
            : ""
        }`}
        src={
          latestPictures ? latestPictures[currentImageIndex].urlThumbnail : ""
        }
        alt={latestPictures ? latestPictures[currentImageIndex].fileName : ""}
      />
      {latestPictures.length > 1 && (
        <img
          className={`imgPhotos ${
            isTransitioning && !startFade
              ? "fade-out"
              : !isTransitioning && !startFade
              ? "fade-in"
              : ""
          }`}
          src={
            latestPictures ? latestPictures[nextImageIndex].urlThumbnail : ""
          }
          alt={latestPictures ? latestPictures[nextImageIndex].fileName : ""}
        />
      )}
    </div>
  );

  return (
    <div key={index} ref={elementRef}>
      <div className="wholeScreenPoM">
        <FootPrints
          toesLeft={toesLeft}
          toesRight={toesRight}
          printCount={15}
          isVisible={isVisible}
          className={index % 2 === 1 ? "reverse" : "printsGallery2"}
        />

        <div className="pictureUnit">
          <div className={`textAndCard ${index % 2 === 1 ? "reverse" : ""}`}>
            <div className={`textElement ${index % 2 === 1 ? "reverse" : ""}`}>
              <h1
                className={`mainHeaderPictures ${
                  startAnim ? "fade-in" : index % 2 === 1 ? "reverse" : ""
                }`}
                onClick={() => navigate(category.path)}
              >
                {language === "fin" ? category.headerFi : category.headerEn}
              </h1>
              <p className="textPictures">
                {language === "fin"
                  ? category.textContentFi
                  : category.textContentEn}
              </p>
            </div>
            <div
              className={`cardPictures ${category.imgClass}Pictures ${
                index % 2 === 1 ? "reverse" : ""
              }`}
              onClick={() => navigate(category.path)}
            >
              {imgPlaceholder}
            </div>
          </div>
        </div>
      </div>
      {index + 1 < length && <hr className="separatorLine" />}
    </div>
  );
};

export default ContentUnit;
