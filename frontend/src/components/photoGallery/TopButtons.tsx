import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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

type TopButtonsProps = {
  isFullScreen: boolean;
  exitFullscreen: () => void;
  enterFullscreen: () => void;
  isActive: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  zoomed: number;
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  openItem: string | undefined;
  toggleItem: (componentClass: string) => void;
  isText: boolean;
  nextPictureIndex: number;
  handleNextPicture: () => void;
  handleExit: () => void;
};

const TopButtons = ({
  isFullScreen,
  exitFullscreen,
  enterFullscreen,
  isActive,
  startTimer,
  stopTimer,
  zoomed,
  handleZoomOut,
  handleZoomIn,
  openItem,
  toggleItem,
  isText,
  nextPictureIndex,
  handleNextPicture,
  handleExit,
}: TopButtonsProps) => {
  useEffect(() => {
    let timer: number;
    if (isActive) {
      timer = setTimeout(() => {
        handleNextPicture();
        if (openItem) {
          toggleItem(openItem);
        } else if (zoomed > 1) {
          handleZoomOut();
        }
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [
    isActive,
    openItem,
    zoomed,
    nextPictureIndex,
    toggleItem,
    handleZoomOut,
    handleNextPicture,
  ]);

  return (
    <div className="ButtonsLbTop">
      <div className={`buttonsLbLeft`}>
        {isText ? (
          <div>
            <FontAwesomeIcon
              onClick={() => toggleItem(".textPomContainer")}
              className={`buttonLB ${isActive ? "hide" : ""}`}
              icon={faFileLines}
            />
          </div>
        ) : (
          <></>
        )}
        <div>
          <FontAwesomeIcon
            onClick={() => toggleItem(".photoInfoContainer")}
            className={`buttonLB ${isActive ? "hide" : ""}`}
            icon={faComments}
          />
        </div>
      </div>
      <div className="buttonsLbRight">
        <div className="fullscreen-btn">
          {isActive ? (
            <FontAwesomeIcon
              onClick={() => stopTimer()}
              className="buttonLB pause"
              icon={faPause}
            />
          ) : (
            <FontAwesomeIcon
              onClick={() => startTimer()}
              className="buttonLB"
              icon={faPlay}
            />
          )}
        </div>
        <div className={`buttonsToHide ${isActive ? "hide" : ""}`}>
          <div className="fullscreen-btn">
            <FontAwesomeIcon
              onClick={() => handleZoomOut()}
              className={`buttonLB ${zoomed >= 1.1 ? "" : "disabled"}`}
              icon={faMagnifyingGlassMinus}
            />
          </div>
          <div className="fullscreen-btn">
            <FontAwesomeIcon
              onClick={() => handleZoomIn()}
              className={`buttonLB ${zoomed < 2.5 ? "" : "disabled"}`}
              icon={faMagnifyingGlassPlus}
            />
          </div>
        </div>
        <div className={`fullscreen-btn`}>
          {isFullScreen ? (
            <FontAwesomeIcon
              onClick={() => exitFullscreen()}
              className="buttonLB"
              icon={faCompress}
            />
          ) : (
            <FontAwesomeIcon
              onClick={() => enterFullscreen()}
              className="buttonLB"
              icon={faExpand}
            />
          )}
        </div>
        <div className="buttonCloseDiv">
          <FontAwesomeIcon
            className="buttonLB buttonClose"
            onClick={() => handleExit()}
            icon={faXmark}
          />
        </div>
      </div>
    </div>
  );
};

export default TopButtons;
