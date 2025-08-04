import React from "react";

import useAnimationLauncher from "../../hooks/useAnimationLauncher";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left.png";
import toesRight from "../../assets/toes-right.png";

import "./AboutContent.css";

type AboutContentProps = {
  headerAbout?: string;
  textAbout: React.JSX.Element;
  src: string;
  alt: string;
  classNamePrints?: string;
  classNameElement?: string;
};

const AboutContent = ({
  headerAbout,
  textAbout,
  src,
  alt,
  classNamePrints,
  classNameElement,
}: AboutContentProps) => {
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

export default AboutContent;
