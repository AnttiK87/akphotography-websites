import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useImageIndex } from "../../hooks/useImageIndex";

import AnimatedText from "../animations/AnimatedText";

import FootPrints from "../animations/FootPrints";
import toesLeft from "../../assets/toes-left-white.png";
import toesRight from "../../assets/toes-right-white.png";

const AboutHeader = () => {
  const { language } = useLanguage();
  const [textIsAnimated, setTextIsAnimated] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const { currentImageIndex, setCurrentImageIndex, images } = useImageIndex();
  const [nextImageIndex, setNextImageIndex] = useState(currentImageIndex + 1);
  const [startAnim, setStartAnim] = useState(false);

  const duration = 5000;

  const headerText = language === "fin" ? "Kameran takana" : "Info about me";
  const textToHeader = headerText.split("\n");

  useEffect(() => {
    if (!images || images.length === 1) return;
    const interval = setInterval(() => {
      setStartAnim((prev) => !prev);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, images]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!images || images.length === 1) return;
      if (startAnim) {
        setCurrentImageIndex((prev) =>
          prev === images?.length - 2
            ? 0
            : prev === images?.length - 1
            ? 1
            : prev + 2
        );
      } else {
        setNextImageIndex(
          currentImageIndex >= images?.length - 1 ? 0 : currentImageIndex + 1
        );
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentImageIndex, setCurrentImageIndex, startAnim, images]);

  useEffect(() => {
    const image = new Image();
    const imageNext = new Image();
    if (images === undefined) return;
    image.src = `/uploads/images/about/${images[currentImageIndex]}`;
    if (images.length > 1)
      imageNext.src = `/uploads/images/about/${images[currentImageIndex + 1]}`;
    image.onload = () => {
      setIsImageReady(true);
    };
  }, [currentImageIndex, images]);

  return (
    <div className="wholeScreen">
      <FootPrints
        toesLeft={toesLeft}
        toesRight={toesRight}
        printCount={15}
        isVisible={isImageReady ? true : false}
      />
      <div className="ImageAndAnimationCont">
        {images === undefined ? (
          <div>Unable to load pictures</div>
        ) : (
          <>
            <div className={`maskImgAbout ${isImageReady ? "ready" : ""}`}>
              <img
                src={`/uploads/images/about/${images[currentImageIndex]}`}
                alt="Background Image"
                loading="eager"
                onLoad={() => setIsImageReady(true)}
                className={`background-image ${isImageReady ? "ready" : ""} ${
                  startAnim ? "fade-out" : "fade-in"
                }`}
              />
              {images.length > 1 && (
                <img
                  src={`/uploads/images/about/${images[nextImageIndex]}`}
                  alt="Background Image"
                  loading="eager"
                  onLoad={() => setIsImageReady(true)}
                  className={`background-image ${isImageReady ? "ready" : ""} ${
                    startAnim ? "fade-in" : "fade-out"
                  }`}
                />
              )}
            </div>
          </>
        )}

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

export default AboutHeader;
