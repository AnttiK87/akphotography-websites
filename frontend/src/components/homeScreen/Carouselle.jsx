import PropTypes from "prop-types";

import { useLocation } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeCategoryLatest } from "../../reducers/pictureReducer";

import useLightBox from "../../hooks/useLightBox";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carouselle.css";

const Carouselle = ({ category }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { openLightBox, setCategory } = useLightBox();

  useEffect(() => {
    dispatch(initializeCategoryLatest(category));
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

  return (
    <>
      <Swiper
        navigation={true}
        pagination={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {latestPictures.length === 0 ? (
          <SwiperSlide>No added Photos in this category</SwiperSlide>
        ) : (
          latestPictures.map((picture, index) => (
            <SwiperSlide key={picture.id}>
              <div className="carouselle">
                <div className="carouTextAndImg">
                  <div
                    onClick={() => {
                      handleOpenLightbox(index);
                    }}
                    className="clickArea"
                  />
                  <img className="carouselleImg" src={picture.urlThumbnail} />
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </>
  );
};

Carouselle.propTypes = {
  category: PropTypes.string.isRequired,
};

export default Carouselle;
