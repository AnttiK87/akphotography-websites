import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
  }, [pathname]);

  return null;
}
