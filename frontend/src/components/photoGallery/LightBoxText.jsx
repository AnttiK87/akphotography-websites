import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const LightBoxText = ({ picture, openItem, toggleItem }) => {
  const handleOverlayClose = (event) => {
    if (event.target.id === "closeModal") {
      toggleItem(".textPomContainer");
    }
  };

  return (
    <div
      id="closeModal"
      className={`OverlayLBT ${
        openItem === ".textPomContainer" ? "show" : "collapsed"
      }`}
      onClick={handleOverlayClose}
    >
      <div
        className={`textPomContainer ${
          openItem === ".textPomContainer" ? "show" : "collapsed"
        }`}
      >
        <div className="paddingRightLBT">
          <div className="imgAndCloseBtn">
            <img
              className="imgSmallPom"
              src={picture.src}
              alt={picture.title}
            />
            <FontAwesomeIcon
              onClick={() => toggleItem(".textPomContainer")}
              className="buttonLB buttonClose white"
              icon={faXmark}
            />
          </div>

          <div className="textPomLB">
            <h1 className="headerPomLB">{picture.title}</h1>
            {picture.description}
          </div>
        </div>
      </div>
    </div>
  );
};

LightBoxText.propTypes = {
  picture: PropTypes.object.isRequired,
  openItem: PropTypes.string,
  toggleItem: PropTypes.func.isRequired,
};

export default LightBoxText;
