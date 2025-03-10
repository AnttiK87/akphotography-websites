// core version + navigation, pagination modules:

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeMonthlyLatest } from "../../reducers/pictureReducer";

// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carouselle.css";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

import { formatMonthYear } from "../../utils/dateUtils";

const Carouselle = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  //set dispatch
  const dispatch = useDispatch();

  //Initialize blogs
  useEffect(() => {
    dispatch(initializeMonthlyLatest());
  }, [dispatch]);

  //get pictures state
  const monthlyPictures = useSelector(
    (state) => state.pictures.latestMonthlyPictures
  );

  return (
    <>
      <Swiper
        navigation={true}
        pagination={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {monthlyPictures.length === 0 ? (
          <SwiperSlide>No added Photos of the Month</SwiperSlide>
        ) : (
          monthlyPictures.map((picture, index) => (
            <SwiperSlide key={picture.id}>
              <div className="carouselle">
                <div
                  className="carouTextAndImg"
                  onClick={() =>
                    navigate(`/pictures/photo-of-the-month/${index}`)
                  }
                >
                  <img className="carouselleImg" src={picture.url} />
                  <div className="carouselleText">
                    <h1 className="carouselleH1">
                      {formatMonthYear(picture.month_year, language)}
                    </h1>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </>
  );
};

export default Carouselle;
