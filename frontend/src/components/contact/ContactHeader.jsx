import "../homeScreen/HomeHeader.css";

import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import AnimatedText from "../animations/AnimatedText";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left-white.png";
import toesRight from "../../assets/toes-right-white.png";

const ContactHeader = () => {
  const { language } = useLanguage();
  const [textIsAnimated, setTextIsAnimated] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);

  const headerText = language === "fin" ? "Ota yhteyttä" : "Contact me";
  const textToHeader = headerText.split("\n");

  useEffect(() => {
    const image = new Image();
    image.src = `../../../images/homeBackground/background2.jpg`;
    image.onload = () => {
      setIsImageReady(true);
    };
  }, []);

  return (
    <div className="wholeScreen">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={isImageReady ? true : false}
      />
      <div className="ImageAndAnimationCont">
        <div className={`maskImgContact ${isImageReady ? "ready" : ""}`}>
          <img
            src={`../../../images/homeBackground/background2.jpg`}
            alt="Background Image"
            loading="eager"
            onLoad={() => setIsImageReady(true)}
            className={`background-image ${isImageReady ? "ready" : ""}`}
          />
        </div>
        {textIsAnimated ? (
          <p className={"animated-text inline-block"}>
            {textToHeader.map((line, lineIndex) => (
              <span className="block" key={`${line}-${lineIndex}`}>
                {line.split(" ").map((word, wordIndex, wordArray) => (
                  <span className="inline-block" key={`${word}-${wordIndex}`}>
                    {word.split("").map((char, charIndex) => (
                      <span
                        key={`${char}-${charIndex}`}
                        className="inline-block"
                      >
                        {char}
                      </span>
                    ))}
                    {wordIndex < wordArray.length - 1 && (
                      <span className="inline-block">&nbsp;</span>
                    )}
                  </span>
                ))}
              </span>
            ))}
          </p>
        ) : isImageReady ? (
          <AnimatedText
            textToAnimate={headerText}
            classNames="animated-text"
            setTextIsAnimated={setTextIsAnimated}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ContactHeader;
