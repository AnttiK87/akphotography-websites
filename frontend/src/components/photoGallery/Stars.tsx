import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

import { showMessage } from "../../reducers/messageReducer";
import { createRating, initializeRatings } from "../../reducers/ratingReducer";
import { getUserId } from "../../utils/createAndGetUserId";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { getPrivacySettings } from "../../utils/readPrivasySettings.js";
import RatingInfo from "./RatingInfo";

import "./Stars.css";

type StarIconsProps = {
  id: number;
  isMobile: boolean;
};

const StarIcons = ({ id, isMobile }: StarIconsProps) => {
  const { allowStoreReviews, allowStoreId } = getPrivacySettings();
  const { language } = useLanguage();

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

  const savedRating = allowStoreReviews
    ? Number(localStorage.getItem(`rating${id}`))
    : 0;

  useEffect(() => {
    dispatch(initializeRatings(id));
    if (allowStoreReviews) {
      localStorage.getItem(`rating${id}`);
      setCurrentUserRating(savedRating ? savedRating : 0);
    }
  }, [dispatch, id, allowStoreReviews, savedRating]);

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
    if (savedRating != 0 && !allowStoreId) {
      dispatch(
        showMessage(
          {
            text: `${
              language === "fin"
                ? "Olet jo arvioinut tämän kuvan. Yksityisyysasetuksesi estävät arvostelun muuttamisen."
                : "You have already reviewed this photo. Your privacy settings doesn't allow updating this review."
            }`,
            type: "error",
          },
          2
        )
      );
      return;
    }

    const updatedRating = currentRating == newRating ? 0 : newRating;

    setCurrentUserRating(updatedRating);
    addRating(updatedRating, id);
  };

  const addRating = async (rating: number, id: number) => {
    if (!allowStoreReviews) {
      dispatch(
        showMessage(
          {
            text: `${
              language === "fin"
                ? "Olet estänyt yksityisyysasetuksista antamiesi arvostelujen tallentamisen"
                : "You have disabled saving reviews from privacy settings."
            }`,
            type: "error",
          },
          2
        )
      );
      return;
    }
    const userId = getUserId();

    const newRating = rating;

    const addRating = {
      rating: newRating,
      pictureId: id,
      userId: userId,
      update: savedRating != 0,
    };

    const resultAction = await dispatch(createRating(addRating));

    if (resultAction) {
      if (rating === 0) {
        if (allowStoreReviews) {
          localStorage.removeItem(`rating${id}`);
        }
        setCurrentUserRating(0);
      } else {
        if (allowStoreReviews) {
          localStorage.setItem(`rating${id}`, String(rating));
        }
      }
    }
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
