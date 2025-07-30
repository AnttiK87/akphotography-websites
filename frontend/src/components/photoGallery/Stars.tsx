import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

import { createRating, initializeRatings } from "../../reducers/ratingReducer";
import { getUserId } from "../../utils/createAndGetUserId";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

import RatingInfo from "./RatingInfo";

import "./Stars.css";

type StarIconsProps = {
  id: number;
  isMobile: boolean;
};

const StarIcons = ({ id, isMobile }: StarIconsProps) => {
  const dispatch = useAppDispatch();
  const ratings = useAppSelector((state) => state.ratings.ratings);

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

  const savedRating = Number(localStorage.getItem(`rating${id}`)) || 0;

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

  useEffect(() => {
    if (savedRating) {
      setCurrentUserRating(savedRating);
    }
  }, [id, savedRating]);

  const handleSettingRating = (
    currentRating: number,
    newRating: number,
    id: number
  ) => {
    const updatedRating = currentRating == newRating ? 0 : newRating;
    setCurrentUserRating(updatedRating);
    addRating(updatedRating, id);
  };

  const addRating = (rating: number, id: number) => {
    const userId = getUserId();

    const newRating = rating;

    const addRating = {
      rating: newRating,
      pictureId: id,
      userId: userId,
    };

    if (rating === 0) {
      localStorage.removeItem(`rating${id}`);
      setCurrentUserRating(0);
    } else {
      localStorage.setItem(`rating${id}`, String(rating));
    }
    dispatch(createRating(addRating));
  };

  return (
    <div className="ratingContainer">
      <div className="rating">
        <div
          onClick={() => {
            setShow(!show);
          }}
        >
          <FontAwesomeIcon className="buttonInfoStars" icon={faCircleInfo} />
        </div>
        <div className="raitingLength">({ratingsLenght})</div>
        {Array.from({ length: 5 }, (_, i) => 5 - i).map((i) => (
          <span
            key={i}
            className={`star ${isMobile ? "mobile" : "desktop"} ${
              avgRating - i >= 0 ? "rated" : ""
            }  ${avgRating - i < 0 && avgRating - i > -1 ? "half" : ""}`}
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
    </div>
  );
};

export default StarIcons;
