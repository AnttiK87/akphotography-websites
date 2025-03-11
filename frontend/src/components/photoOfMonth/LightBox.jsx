import { useState, useRef, useEffect, useCallback } from "react";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faXmark,
  faExpand,
  faCompress,
  faFileLines,
  faComments,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

import useMonthlyPictures from "../../hooks/useMonthlyPictures";
import useTimer from "../../hooks/useTimer";

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

  const { isActive, startTimer, stopTimer } = useTimer(); // 3 sekunnin ajastin
  console.log(`ìsActive: ${isActive}`);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [zoomed, setZoomed] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleZoomIn = (zoomed) => {
    if (zoomed < 3) {
      setZoomed(zoomed + 0.5);
    }
  };

  const handleZoomOut = (zoomed, standard) => {
    if (standard) {
      setPosition({ x: 0, y: 0 });
      setStartPos({ x: 0, y: 0 });
      setZoomed(1);
      return;
    }
    if (zoomed > 2) {
      setZoomed(zoomed - 1);
      return;
    }
    if (zoomed <= 2) {
      setPosition({ x: 0, y: 0 });
      setStartPos({ x: 0, y: 0 });
      setZoomed(1);
      return;
    }
  };

  const handleMouseDown = (e) => {
    if (zoomed > 1) {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    },
    [dragging, startPos]
  );

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove]);

  const basePath = location.pathname.replace(/\/\d+$/, "");
  console.log(`basePath:${basePath}`);

  const { isLoading, isError, pictures } = useMonthlyPictures(language);

  const nextUrl =
    parsedIndex === pictures.length - 1
      ? `/pictures/photo-of-the-month/${0}`
      : `/pictures/photo-of-the-month/${parsedIndex + 1}`;

  const prevUrl =
    parsedIndex === 0
      ? `/pictures/photo-of-the-month/${pictures.length - 1}`
      : `/pictures/photo-of-the-month/${parsedIndex - 1}`;

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setTimeout(() => {
        navigate(nextUrl);
      }, 3000);
    }
    return () => clearTimeout(timer); // Tyhjennetään ajastin, jos komponentti unmountataan tai tila muuttuu
  }, [isActive, navigate, nextUrl]);

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
    <>
      <div
        key={parsedIndex}
        ref={lightboxRef}
        className={`lightBoxBC ${isActive ? "slideShow" : ""}`}
      >
        <div className="stars">
          <StarIcons id={pictures[parsedIndex].id} />
        </div>
        <div className="ButtonsLbTop">
          <div className="buttonsLbLeft">
            <div
              onClick={() =>
                toggleItem(".textPomContainer", isInfoOpen, setIsInfoOpen)
              }
            >
              <FontAwesomeIcon className="buttonInfoLB" icon={faFileLines} />
            </div>
            <div
              onClick={() =>
                toggleItem(".photoInfoContainer", isInfoOpen, setIsInfoOpen)
              }
            >
              <FontAwesomeIcon className="buttonInfoLB" icon={faComments} />
            </div>
          </div>
          <div className="buttonsLbRight">
            <div
              className="fullscreen-btn"
              onClick={isActive ? () => stopTimer() : () => startTimer()}
            >
              {isActive ? (
                <FontAwesomeIcon className="buttonFullLB" icon={faPause} />
              ) : (
                <FontAwesomeIcon className="buttonFullLB" icon={faPlay} />
              )}
            </div>
            <div
              className="fullscreen-btn"
              onClick={() => handleZoomOut(zoomed)}
            >
              <FontAwesomeIcon
                className={`buttonFullLB ${zoomed >= 1.1 ? "" : "disabled"}`}
                icon={faMagnifyingGlassMinus}
              />
            </div>
            <div
              className="fullscreen-btn"
              onClick={() => handleZoomIn(zoomed)}
            >
              <FontAwesomeIcon
                className={`buttonFullLB ${zoomed < 3 ? "" : "disabled"}`}
                icon={faMagnifyingGlassPlus}
              />
            </div>
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
        </div>
        <div className="lightBoxContainer">
          <div onClick={() => navigate(prevUrl)}>
            <FontAwesomeIcon className="buttonBackLB" icon={faChevronDown} />
          </div>
          <div
            style={{
              maxWidth: zoomed > 1 ? "100vw" : "80%",
              maxHeight: zoomed > 1 ? "100vh" : "85%",
              overflow: "hidden",
              cursor: zoomed > 1 ? "grab" : "zoom-in",
            }}
            ref={containerRef}
            onClick={zoomed < 1.1 ? () => handleZoomIn(zoomed) : null}
            onDoubleClick={
              zoomed < 3 && zoomed > 1
                ? () => handleZoomIn(zoomed)
                : () => handleZoomOut(zoomed, 1)
            }
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`lightBoxImgContainer ${
              isFullScreen ? "fullScreen" : ""
            }`}
          >
            <img
              ref={imgRef}
              draggable={false}
              style={{
                transform:
                  zoomed > 1
                    ? `scale(${zoomed}) translate(${position.x}px, ${position.y}px)`
                    : "none",
                transformOrigin: "center",
                transition: dragging ? "none" : "transform 0.2s ease-in-out",
                cursor: dragging ? "grabbing" : zoomed > 1 ? "grab" : "zoom-in",
              }}
              className="lightBoxImg"
              src={pictures[parsedIndex].src}
              alt={pictures[parsedIndex].title}
            />
          </div>
          <div onClick={() => navigate(nextUrl)}>
            <FontAwesomeIcon className="buttonNextLB" icon={faChevronDown} />
          </div>
        </div>
        <div className="photoInfoContainer collapsed">
          <div
            className="toggle"
            onClick={() =>
              toggleItem(".photoInfoContainer", isInfoOpen, setIsInfoOpen)
            }
          >
            <FontAwesomeIcon className="buttonUpLB" icon={faXmark} />
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
    </>
  );
};

export default LightBox;
