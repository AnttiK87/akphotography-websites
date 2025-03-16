import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const LightBoxText = ({ picture, openItem, toggleItem }) => {
  return (
    <div
      className={`textPomContainer ${
        openItem === ".textPomContainer" ? "show" : "collapsed"
      }`}
    >
      <div className="buttonCloseTextLB">
        <FontAwesomeIcon
          onClick={() => toggleItem(".textPomContainer")}
          className="buttonLB buttonClose white"
          icon={faXmark}
        />
      </div>
      <img className="imgSmallPom" src={picture.src} alt={picture.title} />
      <div className="textPomLB">
        <h1 className="headerPomLB">{picture.title}</h1>
        {picture.description}
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
