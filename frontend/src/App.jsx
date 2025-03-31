import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";

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

function App() {
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
