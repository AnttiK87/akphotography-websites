import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import ImageMetadata from "./ExifExtractor.js";
import AdditionalInfo from "./AdditionalInfo";
import Comments from "./Comments";
import useLightBox from "../../hooks/useLightBox.js";

import { handleOverlayClose } from "../../utils/closeOverlay.js";

import type { GalleryPicture } from "../../types/pictureTypes";

type LightBoxInfoProps = {
  picture: GalleryPicture;
  openItem?: string;
  toggleItem: (value: string) => void;
  setShow: (value: boolean) => void;
  setEdit: (value: boolean) => void;
  setReply: (value: boolean) => void;
};

const LightBoxInfo = ({
  picture,
  openItem,
  toggleItem,
  setShow,
  setEdit,
  setReply,
}: LightBoxInfoProps) => {
  const { setCurrentComment } = useLightBox();

  const handleClose = () => {
    toggleItem(".photoInfoContainer");
  };

  return (
    <div
      id="closeModal"
      className={`OverlayLBT ${
        openItem === ".photoInfoContainer" ? "show" : "collapsed"
      }`}
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
    >
      <div
        className={`photoInfoContainer ${
          openItem === ".photoInfoContainer" ? "show" : "collapsed"
        }`}
      >
        <div className="paddingForSB">
          <div className="toggle">
            <FontAwesomeIcon
              onClick={() => toggleItem(".photoInfoContainer")}
              className="buttonLB buttonClose white"
              icon={faXmark}
            />
          </div>
          <div className="metadataContainer">
            <div className="scrollableContainer">
              <ImageMetadata src={picture.srcFullRes} />
              <AdditionalInfo picture={picture} />
            </div>
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
    </div>
  );
};

export default LightBoxInfo;
