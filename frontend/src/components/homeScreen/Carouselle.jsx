import PropTypes from "prop-types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeCategoryLatest } from "../../reducers/pictureReducer";

// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carouselle.css";

import { useNavigate, useLocation } from "react-router-dom";

//import { useLanguage } from "../../hooks/useLanguage";
//import { formatMonthYear } from "../../utils/dateUtils";

const Carouselle = ({ category }) => {
  const navigate = useNavigate();
  //const { language } = useLanguage();
  //set dispatch
  const dispatch = useDispatch();
  const location = useLocation();

  console.log(`path: ${location.pathname.replace(/\/\d+$/, "")}`);

  const basePath =
    location.pathname.replace(/\/\d+$/, "") === "/"
      ? "/pictures/photo-of-the-month"
      : location.pathname.replace(/\/\d+$/, "");

  //Initialize blogs
  useEffect(() => {
    dispatch(initializeCategoryLatest(category));
  }, [dispatch, category]);

  //get pictures state
  const latestPictures = useSelector(
    (state) => state.pictures.latestCategoryPictures
  );

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
                <div
                  className="carouTextAndImg"
                  onClick={() => {
                    sessionStorage.setItem("scrollPosition", window.scrollY);
                    navigate(`${basePath}/${index}`, {
                      state: { from: location.pathname },
                    });
                  }}
                >
                  <img className="carouselleImg" src={picture.url} />
                  {/*<div className="carouselleText">
                    <h1 className="carouselleH1">
                      {formatMonthYear(picture.month_year, language)}
                    </h1>
                  </div>*/}
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
