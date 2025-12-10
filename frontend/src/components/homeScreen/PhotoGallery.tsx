import "./PhotoGallery.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import { getText } from "../../utils/getText";

import type { UiText } from "../../types/uiTextTypes";

type PhotoGalleryProps = {
  texts: UiText[];
};

const PhotoGallery = ({ texts }: PhotoGalleryProps) => {
  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.01);

  const navigate = useNavigate();

  const [reached, setReached] = useState([false, false, false]);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      const rectTop =
        elementRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollPercent =
        ((window.scrollY - rectTop) / elementRef.current.scrollHeight) * 100;

      if (scrollPercent >= 50) setReached([true, true, true]);
      else if (scrollPercent >= 35) setReached([true, true, false]);
      else if (scrollPercent >= 20) setReached([true, false, false]);
      else setReached([false, false, false]);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [elementRef]);

  if (isVisible) {
    const links = document.querySelectorAll(".card");
    let delay = 300;

    links.forEach((link) => {
      setTimeout(() => {
        link.classList.add("show");
      }, delay);
      delay += 700;
    });
  }

  const galleryItems = [
    {
      path: "/pictures/mammals",
      imgClass: "mammals",
      textFi: getText(texts, "card_title_mammals", "fin"),
      textEn: getText(texts, "card_title_mammals", "en"),
      src: "/uploads/images/galleryCover/mammals.jpg",
      textContentFi: getText(texts, "card_text_mammals", "fin"),
      textContentEn: getText(texts, "card_text_mammals", "en"),
    },
    {
      path: "/pictures/landscapes",
      imgClass: "landscapes",
      textFi: getText(texts, "card_title_landscapes", "fin"),
      textEn: getText(texts, "card_title_landscapes", "en"),
      src: "/uploads/images/galleryCover/landscapes.jpg",
      textContentFi: getText(texts, "card_text_landscapes", "fin"),
      textContentEn: getText(texts, "card_text_landscapes", "en"),
    },
    {
      path: "/pictures/birds",
      imgClass: "birds",
      textFi: getText(texts, "card_title_bird", "fin"),
      textEn: getText(texts, "card_title_bird", "en"),
      src: "/uploads/images/galleryCover/birds.jpg",
      textContentFi: getText(texts, "card_text_bird", "fin"),
      textContentEn: getText(texts, "card_text_bird", "en"),
    },
    {
      path: "/pictures/nature",
      imgClass: "nature",
      textFi: getText(texts, "card_title_nature", "fin"),
      textEn: getText(texts, "card_title_nature", "en"),
      src: "/uploads/images/galleryCover/nature.jpg",
      textContentFi: getText(texts, "card_text_nature", "fin"),
      textContentEn: getText(texts, "card_text_nature", "en"),
    },
  ];

  const galleryHeader =
    language === "fin"
      ? getText(texts, "gallery_header", "fin")
      : getText(texts, "gallery_header", "en");
  const galleryText =
    language === "fin"
      ? getText(texts, "gallery_text", "fin")
      : getText(texts, "gallery_text", "en");

  return (
    <div ref={elementRef} className="scrollContainer">
      <main className="scrollEffect">
        <FootPrints
          toesLeft={toesLeft}
          toesRight={toesRight}
          printCount={19}
          isVisible={isVisible}
        />
        <div className="containerGalleryText">
          <p className={`headerGallery ${startAnim ? "fade-in" : ""}`}>
            {galleryHeader}
          </p>
          <p className={`textGallery ${startAnim ? "fade-in" : ""}`}>
            {galleryText}
          </p>
        </div>
        <div className="galleryContainer">
          {galleryItems.map(
            (
              {
                path,
                imgClass,
                textFi,
                textEn,
                src,
                textContentFi,
                textContentEn,
              },
              index
            ) => {
              const isReached = reached[3 - index];
              const isFirst = reached[2 - index];

              return (
                <div
                  key={index}
                  onClick={() => navigate(path)}
                  className={`card ${imgClass} ${
                    isReached ? (index % 2 === 0 ? "hideL" : "hideR") : ""
                  } ${isFirst ? "first" : ""} ${
                    index - 3 === 0 ? "first" : ""
                  }`}
                >
                  <div className="imgAndText">
                    <img className="imgGallery" src={src} alt={imgClass} />
                    <p className="textContent">
                      {language === "fin" ? textContentFi : textContentEn}
                    </p>
                  </div>
                  <p className="textImg">
                    {language === "fin" ? textFi : textEn}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
};

export default PhotoGallery;
