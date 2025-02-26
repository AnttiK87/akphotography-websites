import "./AboutContent.css";

import PropTypes from "prop-types";

import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

const AboutContent = ({
  textAbout,
  src,
  alt,
  classNamePrints,
  classNameElement,
}) => {
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.2);

  return (
    <div ref={elementRef} className="wholeScreenAbout">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={10}
        isVisible={isVisible}
        className={classNamePrints}
      />
      <div className="grid-container-about">
        <div
          className={`elementAbout1 ${classNameElement} ${
            startAnim ? "fade-in" : ""
          }`}
        >
          {textAbout}
        </div>
        <div
          className={`elementAbout2 ${classNameElement} ${
            startAnim ? "fade-in" : ""
          }`}
        >
          <img src={src} alt={alt} />
        </div>
      </div>
    </div>
  );
};

AboutContent.propTypes = {
  textAbout: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  classNamePrints: PropTypes.string,
  classNameElement: PropTypes.string,
};

export default AboutContent;
