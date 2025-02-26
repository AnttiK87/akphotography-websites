// core version + navigation, pagination modules:
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carouselle.css";

//import { useLanguage } from "../../hooks/useLanguage";

const Carouselle = () => {
  //const { language } = useLanguage();

  return (
    <>
      <Swiper
        navigation={true}
        pagination={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="../images/homepage/me.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="../../images/homepage/great-tit-fly.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="../images/homepage/me.jpg" />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Carouselle;
