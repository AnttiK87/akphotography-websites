import "./FootPrints.css";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const FootPrints = ({
  toesLeft,
  toesRight,
  printCount,
  isVisible,
  className,
}) => {
  const [visibleFootprints, setVisibleFootprints] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisible) {
        setVisibleFootprints((prev) => (prev < printCount ? prev + 1 : prev));
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isVisible, printCount]);

  return (
    <div className={`printsDiv ${className ? className : ""}`}>
      {[...Array(printCount)].map((_, i) => (
        <div
          key={i}
          className={`footprint ${
            i % 2 === 0 ? "footprint-left" : "footprint-right"
          }`}
          style={{
            opacity: i < visibleFootprints ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <img
            src={i % 2 === 0 ? toesLeft : toesRight}
            alt={`Footprint ${i}`}
          />
        </div>
      ))}
    </div>
  );
};

FootPrints.propTypes = {
  toesLeft: PropTypes.string.isRequired,
  toesRight: PropTypes.string.isRequired,
  printCount: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default FootPrints;
