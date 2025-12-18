import React from "react";

import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import useGalleryNewIndicator from "../../hooks/useGalleryNewIndicator";

import type { Language } from "../../types/types";

type PictureItem = {
  label: string;
  link: string;
  category: string;
};

type LanguageItem = {
  label: React.JSX.Element;
  value: Language;
};

type ItemType = PictureItem[] | LanguageItem[];

type EditPictureProps = {
  title: React.JSX.Element;
  items: ItemType;
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  classes?: string;
  languageSelect?: boolean;
};

const DropMenu = ({
  title,
  items,
  showDropdown,
  setShowDropdown,
  classes,
  languageSelect,
}: EditPictureProps) => {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { newImages, getNewImages, getNewImagesByCategory } =
    useGalleryNewIndicator();
  const countAll = getNewImages(newImages).length;

  const isTouchDevice = () => {
    return "onTouchStart" in window || navigator.maxTouchPoints > 0;
  };

  const handleToggleDropdown = () => {
    if (isTouchDevice()) {
      setShowDropdown(showDropdown ? false : true);
    }
  };

  const eventHandlers = isTouchDevice()
    ? {
        onTouchStart: handleToggleDropdown,
        onMouseEnter: () => setShowDropdown(true),
        onMouseLeave: () => setShowDropdown(false),
      }
    : {
        onTouchStart: handleToggleDropdown,
        onMouseEnter: () => setShowDropdown(true),
        onMouseLeave: () => setShowDropdown(false),
      };

  return (
    <NavDropdown
      className={classes}
      title={
        !languageSelect ? (
          <div className="textAndDot">
            <span
              className="menuText menuLink"
              onClick={() => navigate("/pictures")}
            >
              {title}
            </span>
            {countAll > 0 ? (
              <>
                <p className="newImages">{countAll > 9 ? "9+" : countAll}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          title
        )
      }
      id="custom-dropdown"
      data-testid={`dropdown-menu-${languageSelect ? "language" : "pictures"}`}
      show={showDropdown}
      {...eventHandlers}
    >
      {items.map((item, index) => (
        <NavDropdown.Item
          key={index}
          className="dropItem"
          as="span"
          onClick={() => {
            if (languageSelect && "value" in item) {
              setLanguage(item.value);
            }
          }}
          onTouchStart={() => handleToggleDropdown}
        >
          {"link" in item ? (
            <div className="textAndDot">
              <Link className="menuText menuLink" to={item.link}>
                {item.label}
              </Link>
              {getNewImagesByCategory(newImages, item.category).length > 0 ? (
                <div className="newImages">
                  {getNewImagesByCategory(newImages, item.category).length > 9
                    ? "9+"
                    : getNewImagesByCategory(newImages, item.category).length}
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <span className="menuText menuLink">{item.label}</span>
          )}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default DropMenu;
