import React from "react";

import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
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
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const handleToggleDropdown = () => {
    if (isTouchDevice()) {
      setShowDropdown(showDropdown ? false : true);
    }
  };

  const eventHandlers = isTouchDevice()
    ? {
        onClick: handleToggleDropdown,
        onMouseEnter: () => setShowDropdown(true),
        onMouseLeave: () => setShowDropdown(false),
      }
    : {
        onMouseEnter: () => setShowDropdown(true),
        onMouseLeave: () => setShowDropdown(false),
      };

  return (
    <NavDropdown
      className={classes}
      title={title}
      id="custom-dropdown"
      data-testid={`dropdown-menu-${languageSelect ? "language" : "pictures"}`}
      show={showDropdown}
      {...eventHandlers}
    >
      {items.map((item, index) => (
        <NavDropdown.Item
          key={index}
          as="span"
          onClick={() => {
            if (languageSelect && "value" in item) {
              setLanguage(item.value);
            }
          }}
        >
          {"link" in item ? (
            <Link className="menuText menuLink" to={item.link}>
              {item.label}
            </Link>
          ) : (
            <span className="menuText menuLink">{item.label}</span>
          )}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default DropMenu;
