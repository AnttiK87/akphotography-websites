import { Routes, Route, useLocation, matchPath } from "react-router-dom";

import "./App.css";

import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Home from "./components/homeScreen/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import PhotoOfMonth from "./components/photoOfMonth/PhotoOfMonth";
import LightBox from "./components/photoOfMonth/LightBox";

import UploadImages from "./components/adminUi/UploadImages";
import Notification from "./components/adminUi/Notification";

function App() {
  const location = useLocation(); // Tunnistaa nykyisen URL-reitin

  const hideLayout =
    location.pathname === "/upload" ||
    matchPath("/pictures/photo-of-the-month/:index", location.pathname);
  // Tarkistaa, pitäisikö Menu ja Footer piilottaa

  if (hideLayout) {
    return (
      <>
        <Notification />
        <Routes>
          <Route path="/upload" element={<UploadImages />} />
          <Route
            path="/pictures/photo-of-the-month/:index"
            element={<LightBox />}
          />
        </Routes>
      </>
    );
  }
  return (
    <>
      <Menu />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/info" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pictures/photo-of-the-month" element={<PhotoOfMonth />} />

        {/* Lisää reitit tänne */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
