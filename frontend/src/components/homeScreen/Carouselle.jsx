import PropTypes from "prop-types";

import { useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import Slider from "react-slick";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeCategoryLatest } from "../../reducers/pictureReducer";

import useLightBox from "../../hooks/useLightBox";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./Carouselle.css";

const Carouselle = ({ category }) => {
  const { language } = useLanguage();
  const location = useLocation();
  const dispatch = useDispatch();

  const { openLightBox, setCategory } = useLightBox();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    dispatch(initializeCategoryLatest(category))
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch, category]);

  const latestPictures = useSelector(
    (state) => state.pictures.latestCategoryPictures
  );

  const handleOpenLightbox = (index) => {
    if (location.pathname === "/") {
      openLightBox(index);
      setCategory("monthly");
      window.history.pushState(
        { lightBox: true },
        "",
        `/pictures/monthly/${index}`
      );
    } else {
      openLightBox(index);
      window.history.pushState(
        { lightBox: true },
        "",
        `${location.pathname}/${index}`
      );
    }
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };

  if (isError) {
    return (
      <div>
        {language === "fin"
          ? "Virhe ladattaessa kuvia"
          : "Error loading pictures"}
      </div>
    );
  }

  if (isLoading) {
    return <div>{language === "fin" ? "Ladataan..." : "Loading..."}</div>;
  }

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {latestPictures && latestPictures.length > 0 ? (
          latestPictures.map((picture, index) => (
            <div key={index}>
              <img
                className="carouselleImg"
                src={picture.urlThumbnail}
                alt={`picture id: ${picture.id}`}
                onClick={() => handleOpenLightbox(index)}
              />
            </div>
          ))
        ) : (
          <div>
            {language === "fin"
              ? "Kategoriassa ei kuvia"
              : "No Pictures in this category"}
          </div>
        )}
      </Slider>
    </div>
  );
};

Carouselle.propTypes = {
  category: PropTypes.string.isRequired,
};

export default Carouselle;
