import { useRef, useEffect, useCallback, useState } from "react";
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
  handleSwipeLeft,
  handleSwipeRight,
  isMobile,
}) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [lastTap, setLastTap] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

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

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);

    const currentTime = new Date().getTime();
    if (currentTime - lastTap < 300) {
      if (zoomed < 2.5 && zoomed >= 1) {
        handleZoomIn(zoomed);
      } else {
        handleZoomOut(zoomed, 1);
      }
    }
    setLastTap(currentTime);

    if (zoomed > 1 && e.touches.length === 1) {
      setDragging(true);
      setStartPos({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!dragging || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - startPos.x;
      const newY = touch.clientY - startPos.y;
      updatePosition(newX, newY);
    },
    [dragging, startPos, updatePosition]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      setDragging(false);

      if (touchStartX !== null && touchStartY !== null) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > 50 && Math.abs(diffY) < 40) {
          if (diffX > 0) {
            if (zoomed === 1) {
              handleSwipeLeft();
            }
          } else {
            if (zoomed === 1) {
              handleSwipeRight();
            }
          }
        }
      }
      setTouchStartX(null);
      setTouchStartY(null);
    },
    [
      touchStartX,
      touchStartY,
      handleSwipeLeft,
      handleSwipeRight,
      setDragging,
      zoomed,
    ]
  );

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    dragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: zoomed === 1 ? "80%" : isMobile ? "fit-content" : "100%",
        maxHeight: zoomed > 1 ? "99%" : "90%",
        overflow: isMobile ? "auto" : "hidden",
        cursor: zoomed > 1 ? "grab" : "zoom-in",
      }}
      onClick={!isMobile && zoomed < 1.1 ? () => handleZoomIn(zoomed) : null}
      onDoubleClick={
        zoomed < 2.5 && zoomed > 1
          ? () => handleZoomIn(zoomed)
          : () => handleZoomOut(zoomed, 1)
      }
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`lightBoxImgContainer ${isFullScreen ? "fullScreen" : ""} ${
        isMobile ? "mobile" : ""
      }`}
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
          transition: dragging ? "none" : "transform 0.2s ease-in-out",
          cursor: zoomed > 1 ? "grab" : "zoom-in",
        }}
        className="lightBoxImg"
        loading="eager"
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
  handleSwipeLeft: PropTypes.func.isRequired,
  handleSwipeRight: PropTypes.func.isRequired,
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
  isMobile: PropTypes.bool,
};

export default LightboxImage;
