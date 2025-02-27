import { Routes, Route } from "react-router-dom";

import "./App.css";

import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Home from "./components/homeScreen/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/info" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Lisää reitit tänne */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
