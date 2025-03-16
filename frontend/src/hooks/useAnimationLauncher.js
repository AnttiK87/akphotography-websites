import { useEffect, useState, useRef } from "react";

const useAnimationLauncher = (threshold) => {
  const [isVisible, setIsVisible] = useState(false);
  const [startAnim, setStartAnim] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const targetNode = elementRef.current;
    if (!targetNode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting && !startAnim) {
          setStartAnim(true);
        }
      },
      { threshold: threshold }
    );

    observer.observe(targetNode);

    return () => {
      observer.unobserve(targetNode);
    };
  }, [startAnim, threshold]);

  return { isVisible, startAnim, elementRef };
};

export default useAnimationLauncher;
