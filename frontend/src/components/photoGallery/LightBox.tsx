import { useState, useEffect, useRef, useCallback } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import usePicturesByCategory from "../../hooks/usePicturesByCategory.js";
import useFullScreen from "../../hooks/useFullScreen.js";
import useZoom from "../../hooks/useZoom.js";
import useTimer from "../../hooks/useTimer.js";
import useToggleItem from "../../hooks/useToggleItem.js";
import useLightBox from "../../hooks/useLightBox.js";
import useIsMobile from "../../hooks/useIsMobile.js";

import TopButtons from "./TopButtons.js";
import LightboxImage from "./LightBoxImage.js";
import LightboxInfo from "./LightBoxInfo.js";
import LightboxText from "./LightBoxText.js";
import StarIcons from "./Stars.js";
import CommentForm from "./CommentForm.js";

import pictureServices from "../../services/pictures.js";

import type { GalleryPicture } from "../../types/pictureTypes.js";

import "./LightBox.css";

const LightBox = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    isLightBoxOpen,
    closeLightBox,
    currentIndex,
    setCurrentIndex,
    category,
    invalidIndex,
    setInvalidIndex,
  } = useLightBox();

  const { isLoading, isError, picturesByCategory } =
    usePicturesByCategory(category);

  const {
    zoomed,
    handleZoomOut,
    handleZoomIn,
    startPos,
    position,
    updatePosition,
    dragging,
    setDragging,
    setStartPos,
  } = useZoom();

  const { openItem, closeItem, toggleItem } = useToggleItem();

  const validateIndex = (
    index: unknown,
    array: GalleryPicture[]
  ): number | null => {
    const parsed = Number(index);
    return Number.isInteger(parsed) && parsed >= 0 && parsed < array.length
      ? parsed
      : null;
  };

  const [validIndex, setValidIndex] = useState(0);

  useEffect(() => {
    if (!isLoading && picturesByCategory.length > 0) {
      const result = validateIndex(currentIndex, picturesByCategory);
      if (result !== null) {
        setValidIndex(result);
        setInvalidIndex(false);
      } else {
        setInvalidIndex(true);
      }
    }
  }, [
    invalidIndex,
    currentIndex,
    picturesByCategory,
    isLoading,
    setInvalidIndex,
  ]);

  const addViewedImage = (imageId: number) => {
    if (imageId != undefined && imageId != null) {
      const sessionViewedImg = localStorage.getItem("viewedImages");
      let viewedImages: number[] = [];

      try {
        viewedImages = sessionViewedImg ? JSON.parse(sessionViewedImg) : [];
      } catch (error) {
        console.warn("Error parsin viewed images in session storage:", error);
        viewedImages = [];
      }

      if (!viewedImages.includes(imageId)) {
        viewedImages.push(imageId);
        localStorage.setItem("viewedImages", JSON.stringify(viewedImages));
        pictureServices.addView(imageId);
      }
    }
  };

  useEffect(() => {
    if (!isLightBoxOpen) return;
    addViewedImage(picturesByCategory[validIndex]?.id);
  }, [validIndex, picturesByCategory, isLightBoxOpen]);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);

  const [isText, setIsText] = useState(false);

  const { isActive, startTimer, stopTimer } = useTimer();

  useEffect(() => {
    if (!isLoading) {
      if (picturesByCategory[validIndex]?.description === "") {
        setIsText(false);
        return;
      } else {
        setIsText(true);
        return;
      }
    }
  }, [isLoading, picturesByCategory, validIndex]);

  const { isFullScreen, enterFullscreen, exitFullscreen } = useFullScreen(
    isMobile,
    isLightBoxOpen
  );

  const nextPictureIndex =
    validIndex === picturesByCategory.length - 1 ? 0 : validIndex + 1;

  const prevPictureIndex =
    validIndex === 0 ? picturesByCategory.length - 1 : validIndex - 1;

  const handleNextPicture = useCallback(() => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    setValidIndex(nextPictureIndex);
    window.history.replaceState({}, "", `${basePath}/${nextPictureIndex}`);
    if (zoomed > 1) {
      handleZoomOut();
    }
  }, [location.pathname, nextPictureIndex, zoomed, handleZoomOut]);

  const handlePrevPicture = useCallback(() => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    setValidIndex(prevPictureIndex);
    window.history.replaceState({}, "", `${basePath}/${prevPictureIndex}`);
    if (zoomed > 1) {
      handleZoomOut();
    }
  }, [location.pathname, prevPictureIndex, zoomed, handleZoomOut]);

  const handleExit = useCallback(() => {
    closeLightBox();
    setCurrentIndex(undefined);

    if (isLightBoxOpen) {
      const parts = location.pathname.split("/").filter(Boolean);
      const basePath = "/" + parts.slice(0, 2).join("/");
      navigate(basePath, { replace: true });
    }

    if (isFullScreen) {
      exitFullscreen();
    }

    if (zoomed > 1) {
      handleZoomOut();
    }

    if (isActive) {
      stopTimer();
    }

    if (openItem) {
      toggleItem(openItem);
    }
  }, [
    closeLightBox,
    setCurrentIndex,
    isLightBoxOpen,
    location.pathname,
    navigate,
    isFullScreen,
    exitFullscreen,
    zoomed,
    handleZoomOut,
    isActive,
    stopTimer,
    openItem,
    toggleItem,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitFullscreen();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isTyping = activeTag
        ? ["input", "textarea", "select", "button"].includes(activeTag)
        : false;

      if (isTyping) {
        return;
      }
      switch (key) {
        case "Escape":
          if (isFullScreen) {
            exitFullscreen();
          } else if (show) {
            setShow(false);
          } else if (isLightBoxOpen) {
            handleExit();
          }
          break;

        case "ArrowRight":
          handleNextPicture();
          break;

        case "ArrowLeft":
          handlePrevPicture();
          break;

        case "ArrowUp":
          if (!openItem) {
            toggleItem(".photoInfoContainer");
          }
          break;

        case "ArrowDown":
          if (!show) {
            closeItem(".photoInfoContainer");
          }
          break;

        case " ":
          if (!show && !openItem) {
            event.preventDefault();
            if (isActive) {
              stopTimer();
            } else {
              startTimer();
            }
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isLightBoxOpen,
    exitFullscreen,
    isFullScreen,
    handleNextPicture,
    handlePrevPicture,
    isActive,
    startTimer,
    stopTimer,
    show,
    toggleItem,
    closeItem,
    openItem,
    handleExit,
  ]);

  useEffect(() => {
    if (!isLoading && picturesByCategory.length > 0) {
      const nextImage = new Image();
      nextImage.src = picturesByCategory[nextPictureIndex]?.srcFullRes;

      const prevImage = new Image();
      prevImage.src = picturesByCategory[prevPictureIndex]?.srcFullRes;
    }
  }, [picturesByCategory, nextPictureIndex, prevPictureIndex, isLoading]);

  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoading && (isError || invalidIndex || !picturesByCategory.length)) {
      exitTimeoutRef.current = setTimeout(() => {
        handleExit();
      }, 1500);
    }

    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, [
    isError,
    picturesByCategory,
    invalidIndex,
    isLoading,
    currentIndex,
    exitTimeoutRef,
    handleExit,
  ]);

  if (!isLightBoxOpen) {
    return null;
  }

  if (invalidIndex)
    return (
      <div className="lightBoxBC InfoTextLB">
        Used index is not valid! Closing...
      </div>
    );
  if (isLoading) return <div className="lightBoxBC InfoTextLB">Loading...</div>;
  if (isError)
    return (
      <div className="lightBoxBC InfoTextLB">
        Error loading pictures! Closing...
      </div>
    );
  if (!picturesByCategory.length)
    return (
      <div className="lightBoxBC InfoTextLB">No pictures found! Closing...</div>
    );
  if (picturesByCategory.length < validIndex)
    return (
      <div className="lightBoxBC InfoTextLB">
        Used index is not valid! Closing...
      </div>
    );

  return (
    <div>
      <div
        key={validIndex}
        className={`lightBoxBC ${isActive ? "slideShow" : ""}`}
      >
        <TopButtons
          isFullScreen={isFullScreen}
          exitFullscreen={exitFullscreen}
          enterFullscreen={enterFullscreen}
          isActive={isActive}
          startTimer={startTimer}
          stopTimer={stopTimer}
          zoomed={zoomed}
          handleZoomOut={handleZoomOut}
          handleZoomIn={handleZoomIn}
          openItem={openItem}
          toggleItem={toggleItem}
          isText={isText}
          nextPictureIndex={nextPictureIndex}
          handleNextPicture={handleNextPicture}
          handleExit={handleExit}
        />
        <div className="lightBoxContainer">
          <div>
            <FontAwesomeIcon
              onClick={() => handlePrevPicture()}
              className={`buttonLB buttonBackLB ${
                isMobile || isActive ? "mobile" : ""
              }`}
              icon={faChevronDown}
            />
          </div>
          <LightboxImage
            src={picturesByCategory[validIndex].srcFullRes}
            alt={picturesByCategory[validIndex].srcFullRes}
            zoomed={zoomed}
            handleZoomOut={handleZoomOut}
            handleZoomIn={handleZoomIn}
            isFullScreen={isFullScreen}
            startPos={startPos}
            position={position}
            updatePosition={updatePosition}
            dragging={dragging}
            setDragging={setDragging}
            setStartPos={setStartPos}
            handleSwipeLeft={handleNextPicture}
            handleSwipeRight={handlePrevPicture}
            isMobile={isMobile}
          />
          <div>
            <FontAwesomeIcon
              onClick={() => handleNextPicture()}
              className={`buttonLB buttonNextLB ${
                isMobile || isActive ? "mobile" : ""
              }`}
              icon={faChevronDown}
            />
          </div>
        </div>
        <LightboxInfo
          picture={picturesByCategory[validIndex]}
          openItem={openItem}
          toggleItem={toggleItem}
          setShow={setShow}
          setEdit={setEdit}
          setReply={setReply}
        />
        <LightboxText
          picture={picturesByCategory[validIndex]}
          openItem={openItem}
          toggleItem={toggleItem}
        />
      </div>
      <div className={`stars ${isActive ? "hide" : ""}`}>
        <StarIcons id={picturesByCategory[validIndex].id} isMobile={isMobile} />
      </div>
      <CommentForm
        show={show}
        setShow={setShow}
        pictureId={picturesByCategory[validIndex].id}
        edit={edit}
        setEdit={setEdit}
        reply={reply}
        setReply={setReply}
        adminComment={false}
      />
    </div>
  );
};

export default LightBox;
