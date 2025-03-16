import { useParams, useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import useMonthlyPictures from "../../hooks/useMonthlyPictures";
import useFullScreen from "../../hooks/useFullScreen";
import useZoom from "../../hooks/useZoom";
import useTimer from "../../hooks/useTimer";

import useToggleItem from "../../hooks/useToggleItem";

import TopButtons from "./TopButtons";
import LightboxImage from "./LightBoxImage";
import LightboxInfo from "./LightBoxInfo";
import LightboxText from "./LightBoxText";
import StarIcons from "./Stars";

import "./LightBox.css";

const LightBox = () => {
  const { index } = useParams();
  const parsedIndex = parseInt(index, 10);

  const { isActive, startTimer, stopTimer } = useTimer();
  const { isLoading, isError, pictures } = useMonthlyPictures();
  const {
    zoomed,
    handleZoomOut,
    handleZoomIn,
    startPos,
    position,
    updatePosition,
    dragging,
    setDragging,
    setStartPos,
  } = useZoom();
  const { openItem, toggleItem } = useToggleItem();
  const { isFullScreen, enterFullscreen, exitFullscreen } = useFullScreen();

  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.replace(/\/\d+$/, "");

  const nextUrl =
    parsedIndex === pictures.length - 1
      ? `${basePath}/${0}`
      : `${basePath}/${parsedIndex + 1}`;

  const prevUrl =
    parsedIndex === 0
      ? `${basePath}/${pictures.length - 1}`
      : `${basePath}/${parsedIndex - 1}`;

  const handleNavigateNext = () => {
    navigate(nextUrl);
    if (zoomed > 1) {
      handleZoomOut();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading pictures</div>;

  return (
    <div>
      <div
        key={parsedIndex}
        className={`lightBoxBC ${isActive ? "slideShow" : ""}`}
      >
        <div className="stars">
          <StarIcons id={pictures[parsedIndex].id} />
        </div>
        <TopButtons
          basePath={basePath}
          nextUrl={nextUrl}
          isFullScreen={isFullScreen}
          exitFullscreen={exitFullscreen}
          enterFullscreen={enterFullscreen}
          isActive={isActive}
          startTimer={startTimer}
          stopTimer={stopTimer}
          zoomed={zoomed}
          handleZoomOut={handleZoomOut}
          handleZoomIn={handleZoomIn}
          openItem={openItem}
          toggleItem={toggleItem}
        />
        <div className="lightBoxContainer">
          <div>
            <FontAwesomeIcon
              onClick={() => navigate(prevUrl)}
              className="buttonLB buttonBackLB"
              icon={faChevronDown}
            />
          </div>
          <LightboxImage
            src={pictures[parsedIndex].src}
            alt={pictures[parsedIndex].title}
            zoomed={zoomed}
            handleZoomOut={handleZoomOut}
            handleZoomIn={handleZoomIn}
            isFullScreen={isFullScreen}
            startPos={startPos}
            position={position}
            updatePosition={updatePosition}
            dragging={dragging}
            setDragging={setDragging}
            setStartPos={setStartPos}
          />
          <div>
            <FontAwesomeIcon
              onClick={() => handleNavigateNext()}
              className="buttonLB buttonNextLB"
              icon={faChevronDown}
            />
          </div>
        </div>
        <LightboxInfo
          picture={pictures[parsedIndex]}
          openItem={openItem}
          toggleItem={toggleItem}
        />
        <LightboxText
          picture={pictures[parsedIndex]}
          openItem={openItem}
          toggleItem={toggleItem}
        />
      </div>
    </div>
  );
};

export default LightBox;
