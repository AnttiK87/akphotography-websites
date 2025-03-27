import { Routes, Route, useLocation, matchPath } from "react-router-dom";

import "./App.css";

import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Home from "./components/homeScreen/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import GalleryByCategory from "./components/photoGallery/GalleryByCategory";
import LightBox from "./components/photoGallery/LightBox";

import AdminMenu from "./components/adminUi/AdminMenu";
import UploadImages from "./components/adminUi/UploadImages";
import HandlePictures from "./components/adminUi/HandlePicture";
import OwnProfile from "./components/adminUi/OwnProfile";
import Notification from "./components/adminUi/Notification";

function App() {
  const location = useLocation(); // Tunnistaa nykyisen URL-reitin
  const adminUi =
    location.pathname === "/admin/login" ||
    location.pathname === "/admin/uploadPictures" ||
    location.pathname === "/admin/editContent" ||
    location.pathname === "/admin/ownProfile";

  if (adminUi) {
    return (
      <>
        <AdminMenu />
        <Notification />
        <Routes>
          <Route path="admin/uploadPictures" element={<UploadImages />} />
          <Route path="/admin/editContent" element={<HandlePictures />} />
          <Route path="/admin/ownProfile" element={<OwnProfile />} />
        </Routes>
      </>
    );
  }

  const hideMenu =
    matchPath("/pictures/photo-of-the-month/:index", location.pathname) ||
    matchPath("/pictures/mammals/:index", location.pathname) ||
    matchPath("/pictures/birds/:index", location.pathname) ||
    matchPath("/pictures/nature/:index", location.pathname) ||
    matchPath("/pictures/landscapes/:index", location.pathname);
  // Tarkistaa, pitäisikö Menu ja Footer piilottaa

  if (hideMenu) {
    return (
      <>
        <Notification />
        <Routes>
          <Route path="/upload" element={<UploadImages />} />
          <Route path="/handlePictures" element={<HandlePictures />} />
          <Route
            path="/pictures/photo-of-the-month/:index"
            element={<LightBox />}
          />
          <Route path="/pictures/mammals/:index" element={<LightBox />} />
          <Route path="/pictures/birds/:index" element={<LightBox />} />
          <Route path="/pictures/nature/:index" element={<LightBox />} />
          <Route path="/pictures/landscapes/:index" element={<LightBox />} />
        </Routes>
      </>
    );
  }
  return (
    <>
      <Menu />
      <Notification />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/info" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/pictures/photo-of-the-month"
          element={<GalleryByCategory />}
        />
        <Route path="/pictures/mammals" element={<GalleryByCategory />} />
        <Route path="/pictures/landscapes" element={<GalleryByCategory />} />
        <Route path="/pictures/nature" element={<GalleryByCategory />} />
        <Route path="/pictures/birds" element={<GalleryByCategory />} />
        {/* Lisää reitit tänne */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
