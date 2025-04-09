import { useState } from "react";

const useTimer = () => {
  const [isActive, setIsActive] = useState(false);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  return { isActive, startTimer, stopTimer };
};

export default useTimer;
