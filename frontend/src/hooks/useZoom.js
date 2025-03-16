import { useState, useRef } from "react";

const useZoom = () => {
  const [zoomed, setZoomed] = useState(1);
  const positionRef = useRef({ x: 0, y: 0 }); // Käytetään ref-arvoa nopeaan päivittämiseen
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomed((prevZoom) => (prevZoom < 2.5 ? prevZoom + 0.5 : prevZoom));
  };

  const handleZoomOut = () => {
    setZoomed(1);
    positionRef.current = { x: 0, y: 0 };
    setPosition({ x: 0, y: 0 });
    setStartPos({ x: 0, y: 0 });
  };

  const updatePosition = (x, y) => {
    positionRef.current = { x, y };
    setPosition({ x, y }); // Päivitetään tila (re-render)
  };

  return {
    zoomed,
    handleZoomIn,
    handleZoomOut,
    position,
    updatePosition, // Uusi funktio ref-arvon päivittämiseen
    dragging,
    setDragging,
    startPos,
    setStartPos,
  };
};

export default useZoom;
