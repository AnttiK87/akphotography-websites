import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../hooks/useLanguage";

import "./Menu.css";

import type { Language } from "../../types/types";

type PictureItem = {
  label: string;
  link: string;
};

type LanguageItem = {
  label: React.JSX.Element;
  value: Language;
};

type ItemType = PictureItem[] | LanguageItem[];

type EditPictureProps = {
  items: ItemType;
  toggleMenu: (
    componentClass: string,
    visibilityClass: string | undefined,
    isOpen: boolean,
    isOpenSetter: (value: boolean) => void
  ) => void;
  className: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  closeAllMenus: () => void;
  languageSelect?: boolean;
};

const DropMenuSmall = ({
  items,
  toggleMenu,
  className,
  isDropdownOpen,
  setIsDropdownOpen,
  closeAllMenus,
  languageSelect,
}: EditPictureProps) => {
  const { language, setLanguage } = useLanguage();

  var classToUse = className === "dropSmall" ? ".dropSmall" : ".dropSmallLang";

  const enableScroll = () => {
    document.body.classList.remove("no-scroll");
  };

  return (
    <div className={`${className} dropVisible collapsed`}>
      <div className="buttonBackMargin">
        <button
          className="menuText menuLink buttonBack"
          onClick={() => {
            toggleMenu(
              classToUse,
              undefined,
              isDropdownOpen,
              setIsDropdownOpen
            );
            enableScroll();
          }}
        >
          <FontAwesomeIcon className="iconButtonBack" icon={faChevronDown} />
          {language === "fin" ? "Takaisin" : "Back"}
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index}>
          {"link" in item ? (
            <span className="nav-link nav-link-small">
              <Link
                className={`menuText menuLink`}
                to={item.link}
                onClick={() => {
                  closeAllMenus();
                  enableScroll();
                }}
              >
                {item.label}
              </Link>
            </span>
          ) : (
            <span
              className="menuText menuLink"
              onClick={() => {
                if (languageSelect && item.value) {
                  setLanguage(item.value);
                  closeAllMenus();
                  enableScroll();
                }
              }}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DropMenuSmall;
