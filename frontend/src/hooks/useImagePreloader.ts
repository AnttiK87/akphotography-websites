import { useEffect, useState } from "react";

export const useImagePreloader = (imageUrls: string[] = []) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setLoaded(true);
        }
      };
    });
  }, [imageUrls]);

  return loaded;
};
