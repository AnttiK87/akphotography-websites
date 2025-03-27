import { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const LightboxImage = ({
  src,
  alt,
  zoomed,
  handleZoomOut,
  handleZoomIn,
  startPos,
  position,
  updatePosition,
  dragging,
  setDragging,
  setStartPos,
  isFullScreen,
}) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (zoomed > 1) {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      updatePosition(newX, newY);
    },
    [dragging, startPos, updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: zoomed > 1 ? "100%" : "80%",
        maxHeight: zoomed > 1 ? "99%" : "90%",
        overflow: "hidden",
        cursor: zoomed > 1 ? "grab" : "zoom-in",
      }}
      onClick={zoomed < 1.1 ? () => handleZoomIn(zoomed) : null}
      onDoubleClick={
        zoomed < 2.5 && zoomed > 1
          ? () => handleZoomIn(zoomed)
          : () => handleZoomOut(zoomed, 1)
      }
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`lightBoxImgContainer ${isFullScreen ? "fullScreen" : ""}`}
    >
      <img
        ref={imgRef}
        draggable={false}
        style={{
          transform:
            zoomed > 1
              ? `scale(${zoomed}) translate(${position.x}px, ${position.y}px)`
              : "none",
          transformOrigin: "center",
          transition: dragging ? "none" : "transform 0.2s ease-in-out", // Poistetaan viive vedettäessä
          cursor: zoomed > 1 ? "grab" : "zoom-in",
        }}
        className="lightBoxImg"
        src={src}
        alt={alt}
      />
    </div>
  );
};

LightboxImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  zoomed: PropTypes.number.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  startPos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  updatePosition: PropTypes.func.isRequired,
  dragging: PropTypes.bool.isRequired,
  setDragging: PropTypes.func.isRequired,
  setStartPos: PropTypes.func.isRequired,
};

export default LightboxImage;
