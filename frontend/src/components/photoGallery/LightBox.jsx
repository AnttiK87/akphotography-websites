import { useState, useEffect, useCallback, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import usePicturesByCategory from "../../hooks/usePicturesByCategory";
import useFullScreen from "../../hooks/useFullScreen";
import useZoom from "../../hooks/useZoom";
import useTimer from "../../hooks/useTimer";
import useToggleItem from "../../hooks/useToggleItem";
import useLightBox from "../../hooks/useLightBox";
import useIsMobile from "../../hooks/useIsMobile.js";

import TopButtons from "./TopButtons";
import LightboxImage from "./LightBoxImage";
import LightboxInfo from "./LightBoxInfo";
import LightboxText from "./LightBoxText";
import StarIcons from "./Stars";
import CommentForm from "./CommentForm.jsx";

import pictureServices from "../../services/pictures.js";

import "./LightBox.css";

const LightBox = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    isLightBoxOpen,
    closeLightBox,
    openLightBox,
    currentIndex,
    category,
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

  const [indexToUse, setIndexToUse] = useState(currentIndex);
  const [indexNum, setIndexNum] = useState(parseInt(indexToUse));
  const [validIndex, setvalidIndex] = useState(
    indexNum >= 0 && !isNaN(indexNum) && indexNum <= picturesByCategory.length
      ? indexNum
      : undefined
  );

  const addViewedImage = (imageId) => {
    let viewedImages = JSON.parse(sessionStorage.getItem("viewedImages")) || [];

    if (!viewedImages.includes(imageId) && imageId) {
      viewedImages.push(imageId);
      sessionStorage.setItem("viewedImages", JSON.stringify(viewedImages));
      pictureServices.addView(imageId);
    }
  };

  useEffect(() => {
    addViewedImage(picturesByCategory[validIndex]?.id);
  }, [validIndex, picturesByCategory]);

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  const [isText, setIsText] = useState(false);

  useEffect(() => {
    setIndexToUse(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    setIndexNum(parseInt(indexToUse));
    setvalidIndex(indexNum >= 0 ? indexNum : undefined);
  }, [indexToUse, indexNum]);

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

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.lightBox) {
        openLightBox();
      } else {
        closeLightBox();
        setvalidIndex(undefined);
        if (isFullScreen) {
          exitFullscreen();
        } else if (zoomed > 1) {
          handleZoomOut();
        } else if (isActive) {
          stopTimer();
        } else if (openItem) {
          toggleItem(openItem);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    openLightBox,
    closeLightBox,
    exitFullscreen,
    handleZoomOut,
    isActive,
    isFullScreen,
    openItem,
    stopTimer,
    toggleItem,
    zoomed,
  ]);

  const nextPictureIndex =
    validIndex === picturesByCategory.length - 1 ? 0 : validIndex + 1;

  const prevPictureIndex =
    validIndex === 0 ? picturesByCategory.length - 1 : validIndex - 1;

  const handleNextPicture = useCallback(() => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    setIndexToUse(nextPictureIndex);
    window.history.replaceState({}, "", `${basePath}/${nextPictureIndex}`);
    if (zoomed > 1) {
      handleZoomOut();
    }
  }, [location.pathname, nextPictureIndex, zoomed, handleZoomOut]);

  const handlePrevPicture = useCallback(() => {
    const basePath = location.pathname.replace(/\/\d+$/, "");
    setIndexToUse(prevPictureIndex);
    window.history.replaceState({}, "", `${basePath}/${prevPictureIndex}`);
    if (zoomed > 1) {
      handleZoomOut();
    }
  }, [location.pathname, prevPictureIndex, zoomed, handleZoomOut]);

  const handleExit = useCallback(() => {
    closeLightBox();
    setvalidIndex(undefined);

    if (isLightBoxOpen) {
      // Remove the last part of the URL path to get the base path
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
    location.pathname,
    isLightBoxOpen,
    closeLightBox,
    setvalidIndex,
    isFullScreen,
    exitFullscreen,
    zoomed,
    handleZoomOut,
    isActive,
    stopTimer,
    openItem,
    toggleItem,
    navigate,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitFullscreen();
      }
    };

    const handleKeyDown = (event) => {
      const key = event.key;
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isTyping = ["input", "textarea", "select", "button"].includes(
        activeTag
      );

      if (key === " " && !show && openItem) {
        event.preventDefault();
      }

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
          if (openItem === null) {
            toggleItem(".photoInfoContainer");
            closeItem();
          }
          break;

        case "ArrowDown":
          if (!show) {
            closeItem(".photoInfoContainer");
            closeItem();
          }
          break;

        case " ":
          if (!show && openItem === null) {
            isActive ? stopTimer() : startTimer();
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
    closeLightBox,
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

  const exitTimeoutRef = useRef(null);

  useEffect(() => {
    if (
      !isLoading &&
      (isError || picturesByCategory.length < validIndex || isNaN(currentIndex))
    ) {
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
    handleExit,
    picturesByCategory,
    validIndex,
    isLoading,
    currentIndex,
    exitTimeoutRef,
  ]);

  if (!isLightBoxOpen) {
    return null;
  }

  if (isNaN(currentIndex) || validIndex === undefined)
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
          setvalidIndex={setvalidIndex}
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
          setCurrentComment={setCurrentComment}
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
        currentComment={currentComment}
      />
    </div>
  );
};

export default LightBox;
