import { useState, useRef } from "react";
import uiComponentService from "../services/uiComponents.js";

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [ms, setMs] = useState(0);
  const startRef = useRef(0);

  async function upload(formData: FormData) {
    startRef.current = performance.now();
    setProgress(0);
    setMs(0);

    return await uiComponentService.changePic(formData, (p, m) => {
      setProgress(p);
      setMs(m);
    });
  }

  return { upload, progress, ms };
}
