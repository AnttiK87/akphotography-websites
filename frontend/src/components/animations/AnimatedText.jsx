/* got ispiration and knowledge for this animation from: 
https://www.frontend.fyi/tutorials/staggered-text-animations-with-framer-motion*/
import PropTypes from "prop-types";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import "./AnimatedText.css";

const animationSpecs = {
  hide: {
    opacity: 0,
    transform: "translateY(20px)",
  },
  show: {
    opacity: 0.9,
    transform: "translateY(0)",
    transition: {
      duration: 0.1,
    },
  },
};

const AnimatedText = ({
  textToAnimate,
  animationPattern = animationSpecs,
  classNames,
  setTextIsAnimated,
}) => {
  const animations = useAnimation();
  const textToAnimateArray = Array.isArray(textToAnimate)
    ? textToAnimate
    : [textToAnimate];

  useEffect(() => {
    const show = () => {
      setTimeout(() => {
        animations.start("show"); // Animaation aloitus viiveellä
        if (setTextIsAnimated) {
          setTimeout(() => {
            setTextIsAnimated(true);
          }, 2000);
        }
      }, 1800); // Viiveen kesto millisekunteina (esim. 500 ms = 0.5 sekuntia)
    };

    show();

    return;
  }, [animations, setTextIsAnimated]);

  return (
    <p className={`inline-block ${classNames}`}>
      <span className="sr-only">{textToAnimate}</span>
      <motion.span
        initial="hide"
        animate={animations}
        variants={{
          show: { transition: { staggerChildren: 0.05 } },
          hide: {},
        }}
        aria-hidden
      >
        {textToAnimateArray.map((line, lineIndex) => (
          <span className="block" key={`${line}-${lineIndex}`}>
            {line.split(" ").map((word, wordIndex, wordArray) => (
              <span className="inline-block" key={`${word}-${wordIndex}`}>
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    className="inline-block"
                    variants={animationPattern}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordIndex < wordArray.length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </p>
  );
};

AnimatedText.propTypes = {
  textToAnimate: PropTypes.string.isRequired,
  animationPattern: PropTypes.string,
  classNames: PropTypes.string,
  setTextIsAnimated: PropTypes.func,
};

export default AnimatedText;
