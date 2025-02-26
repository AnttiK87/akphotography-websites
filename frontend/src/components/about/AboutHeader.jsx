import "./AboutHeader.css";

import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import AnimatedText from "../animations/AnimatedText";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left-white.png";
import toesRight from "../../assets/toes-right-white.png";

const AboutHeader = () => {
  const { language } = useLanguage();
  const [textIsAnimated, setTextIsAnimated] = useState(false);

  const headerText = language === "fin" ? "Kameran takana" : "Info about me";
  const textToHeader = headerText.split("\n");

  return (
    <div className="wholeScreenAbout1">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={true}
      />
      <div className="imgContainer">
        <img
          src={`../../../images/homepage/me.jpg`}
          alt="Background Image"
          className="background-image-about"
        />
      </div>
      {textIsAnimated ? (
        <p className={"animated-text inline-block"}>
          <span aria-hidden>
            {textToHeader.map((line, lineIndex) => (
              <span className="block" key={`${line}-${lineIndex}`}>
                {line.split(" ").map((word, wordIndex) => (
                  <span className="inline-block" key={`${word}-${wordIndex}`}>
                    {word.split("").map((char, charIndex) => (
                      <span
                        key={`${char}-${charIndex}`}
                        className="inline-block"
                      >
                        {char}
                      </span>
                    ))}
                    <span className="inline-block">&nbsp;</span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </p>
      ) : (
        <AnimatedText
          textToAnimate={headerText}
          classNames="animated-text"
          setTextIsAnimated={setTextIsAnimated}
        />
      )}
    </div>
  );
};

export default AboutHeader;
