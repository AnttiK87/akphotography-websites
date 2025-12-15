import { useState, useEffect } from "react";
import { useAppDispatch } from "./hooks/useRedux.js";

import { initializesUiTexts } from "./reducers/uiTextsReducer.js";

import { Routes, Route, useLocation } from "react-router-dom";
import { useLanguage } from "./hooks/useLanguage";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { useImageIndex } from "./hooks/useImageIndex";

import "./App.css";

import ErrorScreen from "./components/ErrorScreen";
import LoadingScreen from "./components/animations/LoadingScreen";

import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Home from "./components/homeScreen/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import GalleryByCategory from "./components/photoGallery/GalleryByCategory";
import LightBox from "./components/photoGallery/LightBox";

import LoginForm from "./components/adminUi/LoginForm";
import AdminMenu from "./components/adminUi/AdminMenu";
import UploadImages from "./components/adminUi/UploadImages";
import HandlePictures from "./components/adminUi/HandlePicture";
import OwnProfile from "./components/adminUi/OwnProfile";
import Notification from "./components/adminUi/Notification";
import UploadOverlay from "./components/adminUi/UploadOverlay";
import FirstLogin from "./components/adminUi/FirstLogin";
import HandlingUiElements from "./components/adminUi/handlingUiComponents/HandlingUiElements";

import NotFound from "./components/error/NotFound";

import birdWhite from "./assets/bird-white.png";
import leaf from "./assets/leaf.png";
import toesLeft from "./assets/toes-left.png";
import toesRight from "./assets/toes-right.png";

function App() {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const adminUi =
    location.pathname === "/admin" ||
    location.pathname === "/admin/uploadPictures" ||
    location.pathname === "/admin/editContent" ||
    location.pathname === "/admin/ownProfile" ||
    location.pathname === "/admin/uiElements";

  const { language } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [textsLoaded, setTextsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { images, isImageError } = useImageIndex();

  const imageUrls = !adminUi ? [birdWhite, leaf, toesLeft, toesRight] : [];
  const imagesLoaded = useImagePreloader(imageUrls);

  useEffect(() => {
    dispatch(initializesUiTexts())
      .then(() => setTextsLoaded(true))
      .catch(() => {
        setTextsLoaded(false);
        setIsError(true);
      });
  }, [dispatch]);

  useEffect(() => {
    const handleLoad = () => {
      if (
        (textsLoaded || isError) &&
        imagesLoaded &&
        images &&
        images.length > 0
      ) {
        setIsLoaded(true);
        document.body.classList.add("app-ready");
      }
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [isLoaded, textsLoaded, imagesLoaded, images, isError]);

  useEffect(() => {
    if (language === "fin") {
      document.documentElement.lang = "fi";
    } else {
      document.documentElement.lang = "en";
    }
  }, [language]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (isError || isImageError) {
    return <ErrorScreen />;
  }

  if (adminUi) {
    return (
      <>
        <AdminMenu />
        <Notification />
        <UploadOverlay />
        <FirstLogin />
        <Routes>
          <Route path="/admin" element={<LoginForm />} />
          <Route path="/admin/uploadPictures" element={<UploadImages />} />
          <Route path="/admin/editContent" element={<HandlePictures />} />
          <Route path="/admin/uiElements" element={<HandlingUiElements />} />
          <Route path="/admin/ownProfile" element={<OwnProfile />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Menu />
      <Notification />
      <LightBox />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pictures/:category" element={<GalleryByCategory />} />
        <Route
          path="/pictures/:category/:index"
          element={<GalleryByCategory />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
