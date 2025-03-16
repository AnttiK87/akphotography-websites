import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import ImageMetadata from "./ExifExtractor";
import AdditionalInfo from "./AdditionalInfo";

import Comments from "./Comments";

const LightBoxInfo = ({ picture, openItem, toggleItem }) => {
  //console.log(`picture: ${JSON.stringify(picture)}`);

  return (
    <>
      <div
        className={`photoInfoContainer ${
          openItem === ".photoInfoContainer" ? "show" : "collapsed"
        }`}
      >
        <div className="toggle">
          <FontAwesomeIcon
            onClick={() => toggleItem(".photoInfoContainer")}
            className="buttonLB buttonClose white"
            icon={faXmark}
          />
        </div>
        <div className="metadataContainer">
          <ImageMetadata src={picture.src} />
          <AdditionalInfo picture={picture} />
        </div>
        <div className="commentsContainer">
          <Comments pictureId={picture.id} />
        </div>
      </div>
    </>
  );
};
LightBoxInfo.propTypes = {
  picture: PropTypes.object.isRequired,
  openItem: PropTypes.string,
  toggleItem: PropTypes.func.isRequired,
};
LightBoxInfo.propTypes = {
  picture: PropTypes.object.isRequired,
};

export default LightBoxInfo;
