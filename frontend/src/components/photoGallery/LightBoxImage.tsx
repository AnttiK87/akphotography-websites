import React from "react";
import { useRef, useEffect, useCallback, useState } from "react";

type PositionValues = {
  x: number;
  y: number;
};

type LightboxImageProps = {
  src: string;
  alt: string;
  zoomed: number;
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  startPos: { x: number; y: number };
  position: { x: number; y: number };
  updatePosition: (x: number, y: number) => void;
  dragging: boolean;
  setDragging: (value: boolean) => void;
  setStartPos: ({ x, y }: PositionValues) => void;
  isFullScreen: boolean;
  handleSwipeLeft: () => void;
  handleSwipeRight: () => void;
  isMobile?: boolean | null | undefined;
};

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
}: LightboxImageProps) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [lastTap, setLastTap] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number>(0);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (zoomed > 1) {
      setDragging(true);
      setStartPos({
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      });
    }
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragging) return;
      event.preventDefault();
      const newX = event.clientX - startPos.x;
      const newY = event.clientY - startPos.y;
      updatePosition(newX, newY);
    },
    [dragging, startPos, updatePosition]
  );

  const handleMouseMoveReact = (event: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(event.nativeEvent);
  };

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);

    const currentTime = new Date().getTime();
    if (isMobile && currentTime - lastTap < 300) {
      if (zoomed < 2.5 && zoomed >= 1) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
    setLastTap(currentTime);

    if (zoomed > 1 && event.touches.length === 1) {
      setDragging(true);
      setStartPos({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!dragging || event.touches.length !== 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      const newX = touch.clientX - startPos.x;
      const newY = touch.clientY - startPos.y;
      updatePosition(newX, newY);
    },
    [dragging, startPos, updatePosition]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      setDragging(false);

      if (touchStartX !== null && touchStartY !== null) {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
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
      setTouchStartX(0);
      setTouchStartY(0);
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

  const handleTouchEndReact = (event: React.TouchEvent<HTMLDivElement>) => {
    handleTouchEnd(event.nativeEvent);
  };

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
        maxWidth: zoomed === 1 ? "80%" : isMobile ? "auto" : "100%",
        maxHeight: zoomed > 1 ? "99%" : "90%",
        height: zoomed > 1 && isMobile ? "99%" : "99%",
        cursor: zoomed > 1 ? "grab" : "zoom-in",
      }}
      onClick={!isMobile && zoomed === 1 ? () => handleZoomIn() : undefined}
      onDoubleClick={
        !isMobile && zoomed < 2.5 && zoomed > 1
          ? () => handleZoomIn()
          : !isMobile
          ? () => handleZoomOut()
          : undefined
      }
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveReact}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndReact}
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

export default LightboxImage;
