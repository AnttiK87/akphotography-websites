import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import { NavDropdown } from "react-bootstrap";
import fiFlag from "../../assets/fi.svg";
import gbFlag from "../../assets/gb.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import "./PrivacyBanner.css";

type PrivacyBannerProps = {
  setShowPrivacy: (value: boolean) => void;
  showPrivacy: boolean;
};

const PrivacyBanner = ({ showPrivacy, setShowPrivacy }: PrivacyBannerProps) => {
  const { language, setLanguage } = useLanguage();
  const STORAGE_KEY = "privacySettings";

  const languageTitle =
    language === "fin" ? (
      <span className="bannerDropText">
        <img className="dropFlag" src={fiFlag} alt="fi flag" width="25" /> Suomi{" "}
        <FontAwesomeIcon className="iconDropdown" icon={faChevronDown} />
      </span>
    ) : (
      <span className="bannerDropText">
        <img className="dropFlag" src={gbFlag} alt="gb flag" width="25" />{" "}
        English{" "}
        <FontAwesomeIcon className="iconDropdown" icon={faChevronDown} />
      </span>
    );

  const defaultSettings = {
    allowStoreViewedImages: true,
    allowStoreReviews: true,
    allowStoreId: true,
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
      setShowPrivacy(false);
    } else {
      setShowPrivacy(true);
    }
  }, [setShowPrivacy]);

  const handleToggle = (
    key: "allowStoreViewedImages" | "allowStoreReviews" | "allowStoreId"
  ) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeAllRatings = () => {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("rating")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    if (settings.allowStoreId === false) {
      localStorage.removeItem("userId");
    }

    if (settings.allowStoreViewedImages === false) {
      localStorage.removeItem("viewedImages");
    }

    if (settings.allowStoreReviews === false) {
      removeAllRatings();
    }

    setShowPrivacy(false);
  };

  const handleDecline = () => {
    const newSettings = {
      allowStoreViewedImages: false,
      allowStoreReviews: false,
      allowStoreId: false,
    };
    setSettings(newSettings);
  };

  const texts = {
    header: {
      fin: "Sivuston tietosuoja ja tietojen tallennus",
      eng: "Site privacy and data storage",
    },

    description: {
      fin: "Sivusto tallentaa tietoja käyttämäsi laitteen selaimeen parantaakseen käyttökokemusta ja mahdollistaakseen sivuston toimintojen käytön. Tallennettavia tietoja ovat valittu kieli, satunnaisesti generoitu tunniste (ID), antamasi arvostelut sekä katsomiesi kuvien tunnisteet. Tunnistetta (ID) käytetään arvostelujen ja kommenttien muokkaamisen mahdollistamiseen. Tallennettuja arvosteluja käytetään estämään arvostelun antaminen useammin kuin kerran kuvaa kohden. Katsottujen kuvien tunnisteita käytetään näyttämään käyttäjälle ilmoituksia uusista kuvista sekä tallentamaan kuville anonyymisti katselukertoja siten, että sama katselu lasketaan vain kerran laitetta kohden. Tallennettua tietoa ei käytetä yksittäisen käyttäjän seurantaan eikä markkinoinnin kohdentamiseen.",
      eng: "The site stores some data in your browser to improve the user experience and to enable the use of site features. The stored data includes your selected language, a randomly generated identifier (ID), the ratings you submit, and identifiers of images you have viewed. The identifier (ID) is used to allow you to edit your submitted ratings and comments. Stored ratings are also used to prevent submitting more than one rating for the same image. Identifiers of viewed images are used to notify you when new images are available and to anonymously record image view counts so that the same view is counted only once per device. The stored data is not used to track individual users or for targeted advertising.",
    },

    switchesHeader: {
      fin: "Salli tämän sivuston:",
      eng: "Let this site:",
    },

    viewedImages: {
      fin: "Tallentaa katsotut kuvat",
      eng: "Save viewed images",
    },

    reviews: {
      fin: "Tallentaa arvostelut",
      eng: "Save ratings",
    },

    id: {
      fin: "Tallentaa ID",
      eng: "Save ID",
    },

    saveButton: {
      fin: "Tallenna",
      eng: "Save",
    },

    removeButton: {
      fin: "Hylkää",
      eng: "Reject",
    },
  };

  if (!showPrivacy) return null;

  return (
    <div className="bannerContainer">
      <div className="privacyBanner">
        <div className="privacyTexts">
          <div className="titleAndLanguage">
            <h3>{texts.header[language]}</h3>
            <NavDropdown
              className="privacy"
              title={languageTitle}
              id="language-dropdown"
            >
              <NavDropdown.Item onClick={() => setLanguage("fin")}>
                <span className="bannerDropText">
                  <img
                    className="dropFlag"
                    src={fiFlag}
                    alt="fi flag"
                    width="25"
                  />
                  {"  "}
                  Suomi
                </span>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setLanguage("eng")}>
                <span className="bannerDropText">
                  <img
                    className="dropFlag"
                    src={gbFlag}
                    alt="gb flag"
                    width="25"
                  />
                  {"  "}
                  English
                </span>
              </NavDropdown.Item>
            </NavDropdown>
          </div>
          <p>{texts.description[language]}</p>
        </div>

        <div className="switchesAndButtons">
          <div className="switches">
            <div className="switchContainer">
              <h3 className="headerSwitches">
                {texts.switchesHeader[language]}
              </h3>
            </div>
            <div className="switchContainer">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.allowStoreViewedImages}
                  onChange={() => handleToggle("allowStoreViewedImages")}
                />
                <span className="slider round"></span>
              </label>
              <p>{texts.viewedImages[language]}</p>
            </div>

            <div className="switchContainer">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.allowStoreReviews}
                  onChange={() => {
                    if (
                      settings.allowStoreId === false &&
                      settings.allowStoreReviews === false
                    ) {
                      handleToggle("allowStoreReviews");
                      setSettings((prev) => ({
                        ...prev,
                        ["allowStoreId"]: true,
                      }));
                    } else {
                      handleToggle("allowStoreReviews");
                    }
                  }}
                />
                <span className="slider round"></span>
              </label>
              <p>{texts.reviews[language]}</p>
            </div>

            <div className="switchContainer">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.allowStoreId}
                  onChange={() => handleToggle("allowStoreId")}
                />
                <span className="slider round"></span>
              </label>
              <p>{texts.id[language]}</p>
            </div>
          </div>

          <div className="buttonsPermission">
            <button
              className="button-primary banner delButton"
              onClick={handleDecline}
            >
              {texts.removeButton[language]}
            </button>
            <button className="button-primary banner" onClick={handleSave}>
              {texts.saveButton[language]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyBanner;
