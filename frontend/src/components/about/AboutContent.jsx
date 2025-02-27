import "./AboutContent.css";

import PropTypes from "prop-types";

import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

const AboutContent = ({
  headerAbout,
  textAbout,
  src,
  alt,
  classNamePrints,
  classNameElement,
}) => {
  const { isVisible, startAnim, elementRef } = useAnimationLauncher(0.3);

  return (
    <div ref={elementRef} className="wholeScreenAbout">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={isVisible}
        className={classNamePrints}
      />
      {headerAbout ? <h1 className="headerAbout">{headerAbout}</h1> : <></>}
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
  headerAbout: PropTypes.string,
  textAbout: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  classNamePrints: PropTypes.string,
  classNameElement: PropTypes.string,
};

export default AboutContent;
