import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { handleOverlayClose } from "../../utils/closeOverlay.js";
import type { GalleryPicture } from "../../types/pictureTypes";

type LightBoxTextProps = {
  picture: GalleryPicture;
  openItem: string | undefined;
  toggleItem: (value: string) => void;
};

const LightBoxText = ({ picture, openItem, toggleItem }: LightBoxTextProps) => {
  const handleClose = () => {
    toggleItem(".textPomContainer");
  };

  return (
    <div
      id="closeModal"
      className={`OverlayLBT ${
        openItem === ".textPomContainer" ? "show" : "collapsed"
      }`}
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
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

export default LightBoxText;
