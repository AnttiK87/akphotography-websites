import { useState } from "react";

const useTimer = () => {
  const [isActive, setIsActive] = useState(false);

  const startTimer = () => {
    console.log("timer started");
    setIsActive(true);
  };

  const stopTimer = () => {
    console.log("timer stopped");
    setIsActive(false);
  };

  return { isActive, startTimer, stopTimer };
};

export default useTimer;
