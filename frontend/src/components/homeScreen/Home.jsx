import "./Home.css";

import HomeHeader from "./HomeHeader";
import HomeWelcome from "./HomeWelcome";
import PhotoGallery from "./PhotoGallery";
import HomePhotoOfMonth from "./HomePhotoOfMonth";

const Home = () => {
  return (
    <div className="homeScreen">
      <HomeHeader />
      <HomeWelcome />
      <hr className="separatorLine" />
      <PhotoGallery />
      <hr className="separatorLine" />
      <HomePhotoOfMonth />
    </div>
  );
};

export default Home;
