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

        // Käynnistä animaatio vain ensimmäisellä kerralla, kun elementti näkyy
        if (entry.isIntersecting && !startAnim) {
          setStartAnim(true);
        }
      },
      { threshold: threshold }
    ); // Voit lisätä thresholdin, jos haluat hienosäätöä

    observer.observe(targetNode);

    return () => {
      observer.unobserve(targetNode);
    };
  }, [startAnim, threshold]); // startAnim riippuvuus varmistaa, että arvo ei mene väärin

  return { isVisible, startAnim, elementRef };
};

export default useAnimationLauncher;
