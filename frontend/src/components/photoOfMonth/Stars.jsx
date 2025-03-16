import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { createRating, initializeRatings } from "../../reducers/ratingReducer";
import { getUserId } from "../../utils/createAndGetUserId";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

import RatingInfo from "./RatingInfo";

import "./Stars.css";

const StarIcons = ({ id }) => {
  const dispatch = useDispatch();
  const ratings = useSelector((state) => state.ratings.ratings);

  //console.log(`avg ratings: ${averageRating}`);

  const [show, setShow] = useState(false);
  const [ratingsLenght, setRatingsLenght] = useState(ratings.length);
  const [currentUserRating, setCurrentUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(
    ratings.length
      ? Number(
          (
            ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
          ).toFixed(2)
        )
      : 0
  );

  const savedRating = localStorage.getItem(`rating${id}`);

  useEffect(() => {
    dispatch(initializeRatings(id));
    localStorage.getItem(`rating${id}`);
  }, [dispatch, id]);

  useEffect(() => {
    setAvgRating(
      ratings.length
        ? Number(
            (
              ratings.reduce((sum, rating) => sum + rating.rating, 0) /
              ratings.length
            ).toFixed(2)
          )
        : 0
    );
    setRatingsLenght(ratings.length);
  }, [ratings, currentUserRating]);

  // Päivitetään rating aina, kun id muuttuu
  useEffect(() => {
    if (savedRating) {
      setCurrentUserRating(savedRating);
    }
  }, [id, savedRating]);

  const handleSettingRating = (currentRating, newRating, id) => {
    const updatedRating = currentRating == newRating ? 0 : newRating;
    setCurrentUserRating(updatedRating);
    addRating(updatedRating, id);
  };

  //Function for adding ratings to db
  const addRating = (rating, id) => {
    const userId = getUserId();

    const newRating = rating;

    const addRating = {
      rating: newRating,
      pictureId: id,
      userId: userId,
    };

    if (rating === 0) {
      localStorage.removeItem(`rating${id}`);
    } else {
      localStorage.setItem(`rating${id}`, rating);
    }
    dispatch(createRating(addRating));
  };

  return (
    <>
      <div className="rating">
        <div
          onClick={() => {
            show ? setShow(false) : setShow(true);
          }}
        >
          <FontAwesomeIcon className="buttonInfoStars" icon={faCircleInfo} />
        </div>
        <div className="raitingLength">({ratingsLenght})</div>
        {Array.from({ length: 5 }, (_, i) => 5 - i).map((i) => (
          <span
            key={i}
            className={`star ${avgRating - i >= 0 ? "rated" : ""}  ${
              avgRating - i < 0 && avgRating - i > -1 ? "half" : ""
            }`}
            onClick={() => handleSettingRating(currentUserRating, i, id)}
          ></span>
        ))}
      </div>
      <RatingInfo
        show={show}
        setShow={setShow}
        lenght={ratingsLenght}
        avgRating={Number(avgRating)}
        addRating={addRating}
        id={Number(id)}
      />
    </>
  );
};

StarIcons.propTypes = {
  id: PropTypes.number.isRequired,
};

export default StarIcons;
