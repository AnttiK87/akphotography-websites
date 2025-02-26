import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../hooks/useLanguage";

const DropMenuSmall = ({
  items,
  toggleMenu,
  className,
  isDropdownOpen,
  setIsDropdownOpen,
  closeAllMenus,
  languageSelect,
}) => {
  const { language, setLanguage } = useLanguage();
  //console.log(className);
  var classToUse = className === "dropSmall" ? ".dropSmall" : ".dropSmallLang";
  //console.log(classToUse);

  const enableScroll = () => {
    document.body.classList.remove("no-scroll");
  };

  return (
    <div className={`${className} dropVisible collapsed`}>
      <div className="buttonBackMargin">
        <button
          className="menuText menuLink buttonBack"
          onClick={() => {
            toggleMenu(classToUse, false, isDropdownOpen, setIsDropdownOpen);
            enableScroll();
          }}
        >
          <FontAwesomeIcon className="iconButtonBack" icon={faChevronDown} />
          {language === "fin" ? "Takaisin" : "Back"}
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index}>
          {item.link ? (
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
                if (languageSelect) {
                  //console.log("you called me");
                  setLanguage(item.value);
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

DropMenuSmall.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      link: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  toggleMenu: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  onItemClick: PropTypes.func,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
  closeAllMenus: PropTypes.func,
  languageSelect: PropTypes.bool,
};

export default DropMenuSmall;
