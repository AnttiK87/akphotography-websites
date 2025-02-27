import "./ContactHeader.css";

import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import AnimatedText from "../animations/AnimatedText";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left-white.png";
import toesRight from "../../assets/toes-right-white.png";

const ContactHeader = () => {
  const { language } = useLanguage();
  const [textIsAnimated, setTextIsAnimated] = useState(false);

  const headerText = language === "fin" ? "Ota yhteyttä" : "Contact me";
  const textToHeader = headerText.split("\n");

  return (
    <div className="wholeScreenContact1">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={10}
        isVisible={true}
      />
      <div className="imgContainerContact">
        <img
          src={`../../../images/homeBackground/background2.jpg`}
          alt="Background Image"
          className="background-image-contact"
        />
      </div>
      {textIsAnimated ? (
        <p className={"animated-text-contact inline-block"}>
          {textToHeader.map((line, lineIndex) => (
            <span className="block" key={`${line}-${lineIndex}`}>
              {line.split(" ").map((word, wordIndex, wordArray) => (
                <span className="inline-block" key={`${word}-${wordIndex}`}>
                  {word.split("").map((char, charIndex) => (
                    <span key={`${char}-${charIndex}`} className="inline-block">
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
      ) : (
        <AnimatedText
          textToAnimate={headerText}
          classNames="animated-text-contact"
          setTextIsAnimated={setTextIsAnimated}
        />
      )}
    </div>
  );
};

export default ContactHeader;
