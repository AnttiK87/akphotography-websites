import PropTypes from "prop-types";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";

const DropMenu = ({
  title,
  items,
  showDropdown,
  setShowDropdown,
  classes,
  languageSelect,
}) => {
  const { setLanguage } = useLanguage();

  return (
    <NavDropdown
      className={classes}
      title={title}
      id="custom-dropdown"
      show={showDropdown}
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      {items.map((item, index) => (
        <NavDropdown.Item
          key={index}
          as="span"
          onClick={() => {
            if (languageSelect) {
              //console.log("you called me");
              setLanguage(item.value);
            }
          }}
        >
          {item.link ? (
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

DropMenu.propTypes = {
  title: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      link: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  showDropdown: PropTypes.bool.isRequired,
  setShowDropdown: PropTypes.func.isRequired,
  classes: PropTypes.string,
  languageSelect: PropTypes.bool,
};

export default DropMenu;
