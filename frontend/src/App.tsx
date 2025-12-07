import { useState, useEffect } from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import { useLanguage } from "./hooks/useLanguage";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { useImageIndex } from "./hooks/useImageIndex";

import "./App.css";

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
import toesLeft from "./assets/toes-left-white.png";
import toesRight from "./assets/toes-right-white.png";
import film from "./assets/film.png";

function App() {
  const { language } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentImageIndex } = useImageIndex();

  const background = new Image();
  background.src = `../../../images/homeBackground/background${currentImageIndex}.jpg`;

  const images = [birdWhite, leaf, toesLeft, toesRight, film, background];

  const imagesLoaded = useImagePreloader(images);

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useEffect(() => {
    if (language === "fin") {
      document.documentElement.lang = "fi";
    } else {
      document.documentElement.lang = "en";
    }
  }, [language]);

  const location = useLocation();
  const adminUi =
    location.pathname === "/admin" ||
    location.pathname === "/admin/uploadPictures" ||
    location.pathname === "/admin/editContent" ||
    location.pathname === "/admin/ownProfile" ||
    location.pathname === "/admin/uiElements";

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

  if (!isLoaded || !imagesLoaded) {
    return <LoadingScreen />;
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
