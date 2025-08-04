/* got ispiration and knowledge for this animation from: 
https://www.frontend.fyi/tutorials/staggered-text-animations-with-framer-motion*/

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import "./AnimatedText.css";

type AnimationSpecs = {
  hide: { opacity: number; transform: string };
  show: {
    opacity: number;
    transform: string;
    transition: { duration: number };
  };
};

const animationSpecs: AnimationSpecs = {
  hide: {
    opacity: 0,
    transform: "translateY(20px)",
  },
  show: {
    opacity: 0.9,
    transform: "translateY(0)",
    transition: {
      duration: 0.2,
    },
  },
};

type AnimatedTextProps = {
  textToAnimate: string;
  animationPattern?: AnimationSpecs;
  classNames: string;
  setTextIsAnimated: (value: boolean) => void;
};

const AnimatedText = ({
  textToAnimate,
  animationPattern = animationSpecs,
  classNames,
  setTextIsAnimated,
}: AnimatedTextProps) => {
  const animations = useAnimation();
  const textToAnimateArray = Array.isArray(textToAnimate)
    ? textToAnimate
    : [textToAnimate];

  useEffect(() => {
    const show = () => {
      setTimeout(() => {
        animations.start("show");
        if (setTextIsAnimated) {
          setTimeout(() => {
            setTextIsAnimated(true);
          }, 3000);
        }
      }, 200);
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
        {textToAnimateArray.map((line: string, lineIndex) => (
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

export default AnimatedText;
