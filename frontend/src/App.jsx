import { useState, useEffect } from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import { useLanguage } from "./hooks/useLanguage";
import { useImagePreloader } from "./hooks/useImagePreloader";

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
import FirstLogin from "./components/adminUi/FirstLogin";

import NotFound from "./components/error/NotFound";

import birdWhite from "./assets/bird-white.png";
import leaf from "./assets/leaf.png";
import toesLeft from "./assets/toes-left-white.png";
import toesRight from "./assets/toes-right-white.png";
import film from "./assets/film.png";
import background1 from "/images/homeBackground/background1.jpg";
import background2 from "/images/homeBackground/background2.jpg";
import background3 from "/images/homeBackground/background3.jpg";
import background4 from "/images/homeBackground/background4.jpg";
import background5 from "/images/homeBackground/background5.jpg";
import background6 from "/images/homeBackground/background6.jpg";
import background7 from "/images/homeBackground/background7.jpg";
import background8 from "/images/homeBackground/background8.jpg";

function App() {
  const { language } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  const images = [
    birdWhite,
    leaf,
    toesLeft,
    toesRight,
    film,
    background1,
    background2,
    background3,
    background4,
    background5,
    background6,
    background7,
    background8,
  ];

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
    location.pathname === "/admin/ownProfile";

  if (adminUi) {
    return (
      <>
        <AdminMenu />
        <Notification />
        <FirstLogin />
        <Routes>
          <Route path="/admin" element={<LoginForm />} />
          <Route path="/admin/uploadPictures" element={<UploadImages />} />
          <Route path="/admin/editContent" element={<HandlePictures />} />
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
        <Route exact path="/" element={<Home />} />
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
