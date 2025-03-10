import { useState, useRef } from "react";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faXmark,
  faExpand,
  faCompress,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import useMonthlyPictures from "../../hooks/useMonthlyPictures";

import ImageMetadata from "./ExifExtractor";
import StarIcons from "./Stars";

import "./LightBox.css";

const LightBox = () => {
  const { index } = useParams();
  const parsedIndex = parseInt(index, 10);
  const lightboxRef = useRef(null);

  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const basePath = location.pathname.replace(/\/\d+$/, "");

  const { isLoading, isError, pictures } = useMonthlyPictures(language);

  const nextUrl =
    parsedIndex === pictures.length - 1
      ? `/pictures/photo-of-the-month/${0}`
      : `/pictures/photo-of-the-month/${parsedIndex + 1}`;

  const prevUrl =
    parsedIndex === 0
      ? `/pictures/photo-of-the-month/${pictures.length - 1}`
      : `/pictures/photo-of-the-month/${parsedIndex - 1}`;

  const toggleItem = (componentClass, isOpen, isOpenSetter) => {
    const components = document.querySelectorAll(componentClass);

    components.forEach((element) => {
      if (isOpen) {
        element.classList.remove("show");
        element.classList.add("collapsed");
      } else {
        element.classList.add("show");
        element.classList.remove("collapsed");
      }
    });

    isOpenSetter(!isOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading pictures</div>;
  }

  // Mene koko näyttöön
  const enterFullscreen = () => {
    if (lightboxRef.current?.requestFullscreen) {
      lightboxRef.current.requestFullscreen();
    } else if (lightboxRef.current?.webkitRequestFullscreen) {
      lightboxRef.current.webkitRequestFullscreen(); // Safari
    } else if (lightboxRef.current?.mozRequestFullScreen) {
      lightboxRef.current.mozRequestFullScreen(); // Firefox
    } else if (lightboxRef.current?.msRequestFullscreen) {
      lightboxRef.current.msRequestFullscreen(); // IE
    }
    setIsFullScreen(true);
  };

  // Poistu koko näytöstä
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Safari
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen(); // Firefox
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen(); // IE
    }
    setIsFullScreen(false);
  };

  return (
    <div ref={lightboxRef} className="lightBoxBC">
      <div
        onClick={() =>
          toggleItem(".textPomContainer", isInfoOpen, setIsInfoOpen)
        }
      >
        <FontAwesomeIcon className="buttonInfoLB" icon={faFileLines} />
      </div>
      <div className="buttonsLB">
        <div
          className="fullscreen-btn"
          onClick={isFullScreen ? exitFullscreen : enterFullscreen}
        >
          {isFullScreen ? (
            <FontAwesomeIcon className="buttonFullLB" icon={faCompress} />
          ) : (
            <FontAwesomeIcon className="buttonFullLB" icon={faExpand} />
          )}
        </div>
        <div onClick={() => navigate(basePath)}>
          <FontAwesomeIcon className="buttonCloseLB" icon={faXmark} />
        </div>
      </div>
      <div className="lightBoxContainer">
        <div onClick={() => navigate(prevUrl)}>
          <FontAwesomeIcon className="buttonBackLB" icon={faChevronDown} />
        </div>
        <img
          className={`lightBoxImg ${isFullScreen ? "fullScreen" : ""}`}
          src={pictures[parsedIndex].src}
          alt={pictures[parsedIndex].title}
        />
        <div onClick={() => navigate(nextUrl)}>
          <FontAwesomeIcon className="buttonNextLB" icon={faChevronDown} />
        </div>
      </div>
      <div className="photoInfoContainer collapsed">
        <div className="toggleAndStars">
          <div
            className="toggle"
            onClick={() =>
              toggleItem(".photoInfoContainer", isInfoOpen, setIsInfoOpen)
            }
          >
            <FontAwesomeIcon className="buttonUpLB" icon={faChevronDown} />
          </div>
          <div className="stars">
            <StarIcons id={pictures[parsedIndex].id} />
          </div>
        </div>
        <div>
          <ImageMetadata src={pictures[parsedIndex].src} />
        </div>
      </div>
      <div className="textPomContainer collapsed">
        <div
          className="buttonCloseTextLB"
          onClick={() =>
            toggleItem(".textPomContainer", isInfoOpen, setIsInfoOpen)
          }
        >
          <FontAwesomeIcon className="buttonCloseLB" icon={faXmark} />
        </div>
        <img
          className="imgSmallPom"
          src={pictures[parsedIndex].src}
          alt={pictures[parsedIndex].title}
        />
        <div className="textPomLB">
          <h1 className="headerPomLB">{pictures[parsedIndex].title}</h1>
          {pictures[parsedIndex].description}
        </div>
      </div>
    </div>
  );
};

export default LightBox;
