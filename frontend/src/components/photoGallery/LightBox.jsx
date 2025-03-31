import { useState, useEffect, useCallback } from "react";

import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import usePicturesByCategory from "../../hooks/usePicturesByCategory";
import useFullScreen from "../../hooks/useFullScreen";
import useZoom from "../../hooks/useZoom";
import useTimer from "../../hooks/useTimer";
import useToggleItem from "../../hooks/useToggleItem";
import useLightBox from "../../hooks/useLightBox";

import TopButtons from "./TopButtons";
import LightboxImage from "./LightBoxImage";
import LightboxInfo from "./LightBoxInfo";
import LightboxText from "./LightBoxText";
import StarIcons from "./Stars";
import CommentForm from "./CommentForm.jsx";

import "./LightBox.css";

const LightBox = () => {
  const location = useLocation();

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

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  //console.log(`lightBoxOpen: ${isLightBoxOpen}`);
  //console.log(`basePath: ${basePath}`);
  //console.log(`indexparams: ${index}`);
  //console.log(`indexToUse: ${indexToUse}`);
  //console.log(`validIndex: ${validIndex}`);
  //console.log(`currentIndex: ${currentIndex}`);
  //console.log(`location.pathname: ${location.pathname}`);

  const [isText, setIsText] = useState(false);

  useEffect(() => {
    setIndexToUse(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    setIndexNum(parseInt(indexToUse));
    setvalidIndex(indexNum >= 0 ? indexNum : undefined);
  }, [indexToUse, indexNum]);

  console.log(`category in lightbox: ${category}`);

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

  useEffect(() => {
    if (
      isError ||
      picturesByCategory.length < validIndex ||
      !picturesByCategory.length
    ) {
      setTimeout(() => {
        //closeLightBox();
      }, 1500);
    }
  }, [isError, /*closeLightBox,*/ picturesByCategory, validIndex]);

  const { isFullScreen, enterFullscreen, exitFullscreen } = useFullScreen();

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
    const basePath = location.pathname.replace(/\/\d+$/, "");
    closeLightBox();
    setvalidIndex(undefined);
    window.history.pushState({ lightBox: false }, "", `${basePath}`);

    if (isFullScreen) {
      exitFullscreen();
    } else if (zoomed > 1) {
      handleZoomOut();
    } else if (isActive) {
      stopTimer();
    } else if (openItem) {
      toggleItem(openItem);
    }
  }, [
    location.pathname,
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
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitFullscreen();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isFullScreen) {
          exitFullscreen();
        } else if (show) {
          setShow(false);
        } else {
          handleExit();
        }
      }
      if (event.key === "ArrowRight") {
        handleNextPicture();
      }
      if (event.key === "ArrowLeft") {
        handlePrevPicture();
      }
      if (event.key === "ArrowUp" && openItem === null) {
        toggleItem(".photoInfoContainer");
        closeItem;
      }
      if (event.key === "ArrowDown" && !show) {
        closeItem(".photoInfoContainer");
        closeItem;
      }
      if (event.key === " " && !show && openItem === null) {
        if (isActive) {
          stopTimer();
        } else {
          startTimer();
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
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
              className="buttonLB buttonBackLB"
              icon={faChevronDown}
            />
          </div>
          <LightboxImage
            src={picturesByCategory[validIndex].src}
            alt={picturesByCategory[validIndex].src}
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
          />
          <div>
            <FontAwesomeIcon
              onClick={() => handleNextPicture()}
              className="buttonLB buttonNextLB"
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
      <div className="stars">
        <StarIcons id={picturesByCategory[validIndex].id} />
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
