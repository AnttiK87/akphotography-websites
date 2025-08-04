import { useLanguage } from "../../hooks/useLanguage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { handleOverlayClose } from "../../utils/closeOverlay.js";

import "./RatingInfo.css";

type RatingInfoProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  lenght: number;
  avgRating: number;
  addRating: (rating: number, id: number) => void;
  id: number;
};

const RatingInfo = ({
  show,
  setShow,
  lenght,
  avgRating,
  addRating,
  id,
}: RatingInfoProps) => {
  const { language } = useLanguage();
  const savedRating = Number(localStorage.getItem(`rating${id}`));

  const handleClose = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  if (!lenght) {
    return (
      <div
        id="closeModal"
        className={`OverlayRI`}
        onMouseDown={(event) => handleOverlayClose(event, handleClose)}
      >
        <div className="ratingInfo">
          <div className="ratingInfoHeader">
            <h3>{language === "fin" ? "Arviot" : "Ratings"}</h3>
            <div onClick={() => setShow(false)}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>
          <div className="ratingInfoText1">
            {language === "fin"
              ? "Tällä kuvalla ei ole vielä arvosteluja."
              : "This picture doesn't have any ratings yet."}
          </div>
        </div>
      </div>
    );
  }

  if (lenght > 0 && !savedRating) {
    return (
      <div
        id="closeModal"
        className={`OverlayRI`}
        onMouseDown={(event) => handleOverlayClose(event, handleClose)}
      >
        <div className="ratingInfo">
          <div className="ratingInfoHeader">
            <h3>{language === "fin" ? "Arviot" : "Ratings"}</h3>
            <div onClick={() => setShow(false)}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>
          <div className="ratingInfoText1">
            {language === "fin" ? (
              <div>
                <div>Et ole vielä antanut tälle kuvalle tähtiä.</div>
                <div className="ratingInfoText2">
                  Kuvalle annettujen arvioiden kokonaismäärä on <b>{lenght}</b>{" "}
                  ja tähtien keskiarvo on: <b>{avgRating}</b>.
                </div>
              </div>
            ) : (
              <div>
                <div>
                  You haven&apos;t given star rating for this picture yet.
                </div>
                <div className="ratingInfoText2">
                  This pictures rating count is: <b>{lenght}</b>, with an
                  average of <b>{avgRating}</b> stars.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="closeModal"
      className={`OverlayRI`}
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
    >
      <div className="ratingInfo">
        <div className="ratingInfoHeader">
          <h3>{language === "fin" ? "Arviot" : "Ratings"}</h3>
          <div onClick={() => setShow(false)}>
            <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
          </div>
        </div>
        <div className="ratingInfoText1">
          {language === "fin" ? (
            <div>
              <div>
                Tälle kuvalle antamasi tähtien määrä on: <b>{savedRating}</b>.
              </div>
              <div className="ratingInfoText2">
                Kuvalle annettujen arvioiden kokonaismäärä on <b>{lenght}</b> ja
                tähtien keskiarvo on: <b>{avgRating}</b>.
              </div>
            </div>
          ) : (
            <div>
              <div>
                Your star rating for this picture is: <b>{savedRating}</b>.
              </div>
              <div className="ratingInfoText2">
                This pictures rating count is: <b>{lenght}</b>, with an average
                of <b>{avgRating}</b> stars.
              </div>
            </div>
          )}
        </div>
        <div className="ratingInfoButtons">
          <button
            className="button-primary  delButton"
            onClick={() => addRating(0, id)}
          >
            {language === "fin" ? "Poista oma arvio" : "Delete your rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingInfo;
