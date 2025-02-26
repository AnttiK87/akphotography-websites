import "./HomeHeader.css";

import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import AnimatedText from "../animations/AnimatedText";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left-white.png";
import toesRight from "../../assets/toes-right-white.png";

const HomeHeader = () => {
  const { language } = useLanguage();
  const [textIsAnimated, setTextIsAnimated] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    Math.floor(Math.random() * 8) + 1
  );
  const duration = 10000;

  const headerText =
    language === "fin"
      ? "Luonnonvaloa kuvaamassa"
      : "Chasing the Light of Nature";
  const textToHeader = headerText.split("\n");

  useEffect(() => {
    // Luodaan intervali kuvan vaihdolle
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        return prevIndex === 8 ? 1 : prevIndex + 1; // Vaihdetaan kuvaa
      });
    }, duration);

    // Siivous
    return () => {
      clearInterval(interval); // Siivotaan interval
    };
  }, [duration]);

  return (
    <div className="wholeScreen">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={true}
      />
      <div className="maskImg">
        <img
          src={`../../../images/homeBackground/background${currentImageIndex}.jpg`}
          alt="Background Image"
          className="background-image"
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

export default HomeHeader;
