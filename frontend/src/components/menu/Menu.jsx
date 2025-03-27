import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import "/node_modules/flag-icons/css/flag-icons.min.css";
import "./Menu.css";

import DropMenu from "./DropMenu";
import DropMenuSmall from "./DropMenuSmall";

import birdWhite from "../../assets/bird-white.png";
import leaf from "../../assets/leaf.png";

const Menu = () => {
  const { language } = useLanguage();

  const languageTitle =
    language === "fin" ? (
      <em>
        <span className="fi fi-fi" /> Suomi{" "}
        <FontAwesomeIcon
          className="menuText menuLink iconDropdown"
          icon={faChevronDown}
        />
      </em>
    ) : (
      <em>
        <span className="fi fi-gb" /> English{" "}
        <FontAwesomeIcon
          className="menuText menuLink iconDropdown"
          icon={faChevronDown}
        />
      </em>
    );

  const languageItems = [
    {
      label: (
        <em>
          <span className="fi fi-fi" />
          {"  "}
          Suomi
        </em>
      ),
      value: "fin",
    },
    {
      label: (
        <em>
          <span className="fi fi-gb" />
          {"  "}
          English
        </em>
      ),
      value: "eng",
    },
  ];

  const picturesTitle = (
    <span className="menuText menuPictures">
      {language === "fin" ? "Kuvat" : "Pictures"}
    </span>
  );

  const pictureItems = [
    {
      label: language === "fin" ? "Nisäkkäät" : "Mammals",
      link: "/pictures/mammals",
    },
    {
      label: language === "fin" ? "Maisemat" : "Landscapes",
      link: "/pictures/landscapes",
    },
    {
      label: language === "fin" ? "Luonto" : "Nature",
      link: "/pictures/nature",
    },
    { label: language === "fin" ? "Linnut" : "Birds", link: "/pictures/birds" },
    {
      label: language === "fin" ? "Kuukauden kuva" : "Photo of the Month",
      link: "/pictures/photo-of-the-month",
    },
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = (
    componentClass,
    visibilityClass,
    isOpen,
    isOpenSetter
  ) => {
    const components = document.querySelectorAll(componentClass);
    var visibilityComponents;

    if (visibilityClass) {
      visibilityComponents = document.querySelectorAll(visibilityClass);
    }

    components.forEach((element) => {
      if (isOpen) {
        element.classList.remove("show");
        element.classList.add("collapsed");
        if (visibilityClass === ".dropVisible") {
          visibilityComponents.forEach((el) =>
            el.classList.remove("visible", "show")
          );
        }
      } else {
        element.classList.add("show");
        element.classList.remove("collapsed");
        if (visibilityClass === ".dropVisible") {
          visibilityComponents.forEach((el) => el.classList.add("visible"));
        }
      }
    });

    isOpenSetter(!isOpen);
  };

  const closeAllMenus = () => {
    const menu = document.querySelectorAll(".navBarSmall");
    const subMenu = document.querySelectorAll(".dropSmall, .dropSmallLang");

    menu.forEach((element) => {
      element.classList.remove("show");
      element.classList.add("collapsed");
      setIsMenuOpen(false);
      menu.style.transition = "none";
    });
    if (subMenu) {
      subMenu.forEach((element) => {
        element.classList.remove("show");
        element.classList.add("collapsed");
        setIsDropdownOpen(false);
        subMenu.style.transition = "none";
      });
    }
  };

  //closes hamburger menu if orientation changes causes to menu view change between normal navbar and hamburger menu
  window.addEventListener("resize", () => {
    const navBarSmall = document.querySelector(".navBarSmall");
    const subMenu = document.querySelectorAll(".dropSmall, .dropSmallLang");

    if (window.innerWidth <= 990) {
      navBarSmall.classList.remove("show");
      navBarSmall.classList.add("collapsed");
      setIsMenuOpen(false);
      navBarSmall.style.transition = "none";

      if (subMenu) {
        subMenu.forEach((element) => {
          element.classList.remove("show");
          element.classList.add("collapsed");
          setIsDropdownOpen(false);
          element.style.transition = "none";
        });
      }

      // Palauta transition pienen viiveen jälkeen
      setTimeout(() => {
        navBarSmall.style.transition = "";
        subMenu.forEach((element) => {
          element.style.transition = "";
        });
      }, 10);
    }
    if (window.innerWidth > 990) {
      enableScroll();
      navBarSmall.style.transition = "none";
      if (subMenu) {
        subMenu.forEach((element) => {
          element.style.transition = "none";
        });

        setTimeout(() => {
          navBarSmall.style.transition = "";
          subMenu.forEach((element) => {
            element.style.transition = "";
          });
        }, 10);
      }
    }
  });

  const disableScroll = () => {
    document.body.classList.add("no-scroll");
  };

  const enableScroll = () => {
    document.body.classList.remove("no-scroll");
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg">
        <div className="navBar">
          <div className="logoAndToggle logoAK">
            <div className="logoSmallScreen">
              <div>
                <img className="leaf" src={leaf} alt={`leaf`} />
                <img className="bird" src={birdWhite} alt={`whiteBird`} />
              </div>
              <h1 className="menuText">AK Photography</h1>
            </div>
            <button
              className={
                isMenuOpen ? "navbar-toggler" : "navbar-toggler  collapsed"
              }
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() =>
                toggleMenu(
                  ".navBarSmall",
                  ".dropVisible",
                  isMenuOpen,
                  setIsMenuOpen
                )
              }
            >
              <span className="line"></span>
              <span className="line"></span>
            </button>
          </div>
          <Navbar.Collapse className="navBarSmall" id="responsive-navbar-nav">
            <Nav className="nav-container mr-auto">
              <div className="logoBigScreen logoAK">
                <div>
                  <img className="leaf" src={leaf} alt={`leaf`} />
                  <img className="bird" src={birdWhite} alt={`whiteBird`} />
                </div>
                <h1 className="menuText">AK Photography</h1>
              </div>
              <div className="links">
                <Nav.Link as="span">
                  <Link
                    className="menuText menuLink"
                    to="/"
                    onClick={() => closeAllMenus()}
                  >
                    {language === "fin" ? "Koti" : "Home"}
                  </Link>
                </Nav.Link>
                <DropMenu
                  title={picturesTitle}
                  items={pictureItems}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  classes={"custom-dropdown menuText pictures"}
                />
                <span className="nav-link dropSmallButton">
                  <a
                    className="menuText menuLink"
                    onClick={() => {
                      toggleMenu(
                        ".dropSmall",
                        false,
                        isDropdownOpen,
                        setIsDropdownOpen
                      );
                      disableScroll();
                    }}
                  >
                    {language === "fin" ? "Kuvat" : "Pictures"}{" "}
                    <FontAwesomeIcon
                      className="menuText menuLink iconDropdown"
                      icon={faChevronDown}
                    />
                  </a>
                </span>
                <Nav.Link as="span">
                  <Link
                    className="menuText menuLink"
                    to="/info"
                    onClick={() => closeAllMenus()}
                  >
                    {language === "fin" ? "Kameran takana" : "About me"}
                  </Link>
                </Nav.Link>
                <Nav.Link as="span">
                  <Link
                    className="menuText menuLink"
                    to="/contact"
                    onClick={() => closeAllMenus()}
                  >
                    {language === "fin" ? "Yhteystiedot" : "Contact"}
                  </Link>
                </Nav.Link>
              </div>
              <div className="icon">
                <a
                  href="https://www.facebook.com/profile.php?id=100081355767265"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
                <a
                  href="https://www.instagram.com/kortelainen.antti/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>

                <DropMenu
                  languageSelect={true}
                  title={languageTitle}
                  items={languageItems}
                  showDropdown={showLanguageDropdown}
                  setShowDropdown={setShowLanguageDropdown}
                  classes={"custom-dropdown menuText languageSelect"}
                />
              </div>
              <span className="nav-link dropSmallButton dropSmallButLang">
                <a
                  className="menuText menuLink"
                  onClick={() => {
                    toggleMenu(
                      ".dropSmallLang",
                      false,
                      isDropdownOpen,
                      setIsDropdownOpen
                    );
                    disableScroll();
                  }}
                >
                  {languageTitle}
                </a>
              </span>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <div className="smallDropContainer dropVisible">
        <DropMenuSmall
          items={pictureItems}
          toggleMenu={toggleMenu}
          className={"dropSmall"}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          closeAllMenus={closeAllMenus}
        />
        <DropMenuSmall
          items={languageItems}
          toggleMenu={toggleMenu}
          className={"dropSmallLang"}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          languageSelect={true}
        />
      </div>
    </>
  );
};

export default Menu;
