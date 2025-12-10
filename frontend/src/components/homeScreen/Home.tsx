import "./Home.css";

import { ImageIndexProvider } from "../../contexts/ImageIndexContext";

import { useAppSelector } from "../../hooks/useRedux.js";
import { makeSelectTextsByScreen } from "../../reducers/selectors/uiTexts";

import HomeHeader from "./HomeHeader";
import HomeWelcome from "./HomeWelcome";
import PhotoGallery from "./PhotoGallery";
import HomePhotoOfMonth from "./HomePhotoOfMonth";

const Home = () => {
  const homeScreenTexts = useAppSelector(makeSelectTextsByScreen("home"));

  return (
    <div className="homeScreen">
      <ImageIndexProvider path="images/homeBackground">
        <HomeHeader texts={homeScreenTexts} />
      </ImageIndexProvider>
      <HomeWelcome texts={homeScreenTexts} />
      <hr className="separatorLine" />
      <PhotoGallery texts={homeScreenTexts} />
      <hr className="separatorLine" />
      <HomePhotoOfMonth texts={homeScreenTexts} />
    </div>
  );
};

export default Home;
