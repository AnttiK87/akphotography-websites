import { useEffect } from "react";
import PropTypes from "prop-types";

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
}) => {
  useEffect(() => {
    let timer;
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
      <div className="buttonsLbLeft">
        {isText ? (
          <div>
            <FontAwesomeIcon
              onClick={() => toggleItem(".textPomContainer")}
              className="buttonLB"
              icon={faFileLines}
            />
          </div>
        ) : (
          <></>
        )}
        <div>
          <FontAwesomeIcon
            onClick={() => toggleItem(".photoInfoContainer")}
            className="buttonLB"
            icon={faComments}
          />
        </div>
      </div>
      <div className="buttonsLbRight">
        <div className="fullscreen-btn">
          {isActive ? (
            <FontAwesomeIcon
              onClick={() => stopTimer()}
              className="buttonLB"
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
        <div className="fullscreen-btn">
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
TopButtons.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
  exitFullscreen: PropTypes.func.isRequired,
  enterFullscreen: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  zoomed: PropTypes.number.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  openItem: PropTypes.string,
  toggleItem: PropTypes.func.isRequired,
  isText: PropTypes.bool.isRequired,
  nextPictureIndex: PropTypes.number.isRequired,
  handleNextPicture: PropTypes.func.isRequired,
  handleExit: PropTypes.func.isRequired,
};

export default TopButtons;
