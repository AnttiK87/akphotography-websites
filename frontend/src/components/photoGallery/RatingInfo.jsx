//Notification component for rendering notifications to user
//dependencies
import { useLanguage } from "../../hooks/useLanguage";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./RatingInfo.css";

const RatingInfo = ({ show, setShow, lenght, avgRating, addRating, id }) => {
  //console.log(`rating info: ${show}, ${lenght}, ${avgRating}, ${id}`);
  const { language } = useLanguage();
  const savedRating = Number(localStorage.getItem(`rating${id}`));

  const handleOverlayClose = (event) => {
    if (event.target.id === "closeModal") {
      setShow(false);
    }
  };

  if (!show) {
    return null;
  }

  if (!lenght) {
    return (
      <div id="closeModal" className={`OverlayRI`} onClick={handleOverlayClose}>
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
      <div id="closeModal" className={`OverlayRI`} onClick={handleOverlayClose}>
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
    <div id="closeModal" className={`OverlayRI`} onClick={handleOverlayClose}>
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

RatingInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  lenght: PropTypes.number.isRequired,
  avgRating: PropTypes.number.isRequired,
  currenUserRating: PropTypes.number,
  addRating: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

//export
export default RatingInfo;
