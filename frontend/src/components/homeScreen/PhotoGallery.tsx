import "./PhotoGallery.css";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import { getText } from "../../utils/getText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

import type { UiText } from "../../types/uiTextTypes";

type PhotoGalleryProps = {
  texts: UiText[];
};

const PhotoGallery = ({ texts }: PhotoGalleryProps) => {
  const { language } = useLanguage();
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.01);

  const navigate = useNavigate();

  const [reached, setReached] = useState([false, false, false]);
  const [next, setNext] = useState<number | undefined>(19);
  const [prev, setPrev] = useState<number | undefined>(undefined);

  const height = elementRef.current
    ? elementRef.current.scrollHeight
    : undefined;
  const rectTop = elementRef.current
    ? elementRef.current.getBoundingClientRect().top + window.scrollY
    : undefined;

  const scrollToNext = (percent: number, rectTop: number, height: number) => {
    const top = (percent / 100) * height + rectTop;
    window.scrollTo({
      top: top,
      behavior: "smooth",
    });
  };

  const scrollToPrew = (percent: number, rectTop: number, height: number) => {
    const top = (percent / 100) * height + rectTop;
    window.scrollTo({
      top: top,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!rectTop || !height) return;

      const scrollPercent = ((window.scrollY - rectTop) / height) * 100;

      if (scrollPercent >= 50) {
        setReached([true, true, true]);
        setNext(undefined);
        setPrev(36);
      } else if (scrollPercent >= 35) {
        setReached([true, true, false]);
        setNext(74);
        setPrev(21);
      } else if (scrollPercent >= 20) {
        setReached([true, false, false]);
        setNext(49);
        setPrev(1);
      } else if (scrollPercent >= 0) {
        setReached([false, false, false]);
        setNext(34);
        setPrev(undefined);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rectTop, height]);

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
          <Link className="LinkPoM" to="/pictures">
            <p className={`headerGallery ${startAnim ? "fade-in" : ""}`}>
              {galleryHeader}
            </p>
          </Link>

          <p className={`textGallery ${startAnim ? "fade-in" : ""}`}>
            {galleryText}
          </p>
        </div>
        <div className="buttonsAndCards">
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
          <div className="cardButton">
            {prev && rectTop && height ? (
              <button
                className="prev"
                onClick={() => scrollToPrew(prev, rectTop, height)}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            ) : (
              <button className="prev disabled">
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
            <FontAwesomeIcon className="dots" icon={faEllipsisVertical} />
            {next && rectTop && height ? (
              <button
                className="next"
                onClick={() => scrollToNext(next, rectTop, height)}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            ) : (
              <button className="next disabled">
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhotoGallery;
