import { useState, useEffect } from "react";

const useRandomAnimationWithDelay = (minDelay = 5000, maxDelay = 10000) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const startAnimation = () => {
      const delay =
        Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      timeoutId = window.setTimeout(() => {
        setAnimate((prev) => !prev);
        startAnimation(); // jatkuu loopissa
      }, delay);
    };

    startAnimation();

    return () => clearTimeout(timeoutId);
  }, [minDelay, maxDelay]);

  return animate;
};

export default useRandomAnimationWithDelay;
