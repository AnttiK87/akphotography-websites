import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import ImageMetadata from "./ExifExtractor";
import AdditionalInfo from "./AdditionalInfo";

import Comments from "./Comments";

const LightBoxInfo = ({
  picture,
  openItem,
  toggleItem,
  setShow,
  setEdit,
  setReply,
  setCurrentComment,
}) => {
  //console.log(`picture: ${JSON.stringify(picture)}`);
  const handleOverlayClose = (event) => {
    if (event.target.id === "closeModal") {
      toggleItem(".photoInfoContainer");
    }
  };

  return (
    <div
      id="closeModal"
      className={`OverlayLBT ${
        openItem === ".photoInfoContainer" ? "show" : "collapsed"
      }`}
      onClick={handleOverlayClose}
    >
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
          <Comments
            pictureId={picture.id}
            setShow={setShow}
            setEdit={setEdit}
            setReply={setReply}
            setCurrentComment={setCurrentComment}
          />
        </div>
      </div>
    </div>
  );
};
LightBoxInfo.propTypes = {
  picture: PropTypes.object.isRequired,
  openItem: PropTypes.string,
  toggleItem: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setReply: PropTypes.func.isRequired,
  setCurrentComment: PropTypes.func.isRequired,
};

export default LightBoxInfo;
