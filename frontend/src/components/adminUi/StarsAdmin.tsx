import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import type { PictureRating } from "../../types/pictureTypes";

type AdminStarRatingProps = {
  ratings: PictureRating[];
  bars?: boolean;
};

const AdminStarRating = ({ ratings, bars }: AdminStarRatingProps) => {
  const totalStars = 5;
  const [avgRating, setAvgRating] = useState(
    ratings?.length
      ? Number(
          (
            ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings?.length
          ).toFixed(2)
        )
      : 0
  );

  const filterRatings = (ratingFilter: number) => {
    const filteredRatings =
      ratings?.filter((rating) => rating.rating === ratingFilter) || [];
    return filteredRatings?.length || 0;
  };

  useEffect(() => {
    setAvgRating(
      ratings?.length
        ? Number(
            (
              ratings.reduce((sum, rating) => sum + rating.rating, 0) /
              ratings.length
            ).toFixed(2)
          )
        : 0
    );
  }, [ratings]);

  return (
    <>
      <div className="starsAndAvg">
        <div className="star-rating">
          <div
            className="star-full"
            style={{ width: `${(avgRating / totalStars) * 100}%` }}
          >
            {[...Array(totalStars)].map((_, i) => (
              <FontAwesomeIcon key={`full-${i}`} icon={faStar} />
            ))}
          </div>
          <div className="star-background">
            {[...Array(totalStars)].map((_, i) => (
              <FontAwesomeIcon key={`bg-${i}`} icon={faStar} />
            ))}
          </div>
        </div>
        {bars ? <div>(avg {avgRating})</div> : <></>}
      </div>
      {bars ? (
        <>
          <div className="barsContainer">
            <div className="ratingBar">
              {ratings?.length > 0 ? (
                <div
                  className="filledBar"
                  style={{
                    width: `${(filterRatings(5) / ratings?.length) * 100}%`,
                  }}
                >
                  5 stars ({filterRatings(5)})
                </div>
              ) : (
                <></>
              )}
              <div className="ratingBar-background">
                5 stars ({filterRatings(5)})
              </div>
            </div>
          </div>
          <div className="barsContainer">
            <div className="ratingBar">
              {ratings?.length > 0 ? (
                <div
                  className="filledBar"
                  style={{
                    width: `${(filterRatings(4) / ratings?.length) * 100}%`,
                  }}
                >
                  4 stars ({filterRatings(4)})
                </div>
              ) : (
                <></>
              )}
              <div className="ratingBar-background">
                4 stars ({filterRatings(4)})
              </div>
            </div>
          </div>
          <div className="barsContainer">
            <div className="ratingBar">
              {ratings?.length > 0 ? (
                <div
                  className="filledBar"
                  style={{
                    width: `${(filterRatings(3) / ratings?.length) * 100}%`,
                  }}
                >
                  3 stars ({filterRatings(3)})
                </div>
              ) : (
                <></>
              )}
              <div className="ratingBar-background">
                3 stars ({filterRatings(3)})
              </div>
            </div>
          </div>
          <div className="barsContainer">
            <div className="ratingBar">
              {ratings?.length > 0 ? (
                <div
                  className="filledBar"
                  style={{
                    width: `${(filterRatings(2) / ratings?.length) * 100}%`,
                  }}
                >
                  2 stars ({filterRatings(2)})
                </div>
              ) : (
                <></>
              )}
              <div className="ratingBar-background">
                2 stars ({filterRatings(2)})
              </div>
            </div>
          </div>
          <div className="barsContainer">
            <div className="ratingBar">
              {ratings?.length > 0 ? (
                <div
                  className="filledBar"
                  style={{
                    width: `${(filterRatings(1) / ratings?.length) * 100}%`,
                  }}
                >
                  1 stars ({filterRatings(1)})
                </div>
              ) : (
                <></>
              )}
              <div className="ratingBar-background">
                1 stars ({filterRatings(1)})
              </div>
            </div>
          </div>
          <div>Total ratings: {ratings?.length}</div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminStarRating;
