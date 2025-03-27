import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import usePicturesByCategory from "../../hooks/usePicturesByCategory";
import useFullScreen from "../../hooks/useFullScreen";
import useZoom from "../../hooks/useZoom";
import useTimer from "../../hooks/useTimer";

import useToggleItem from "../../hooks/useToggleItem";

import TopButtons from "./TopButtons";
import LightboxImage from "./LightBoxImage";
import LightboxInfo from "./LightBoxInfo";
import LightboxText from "./LightBoxText";
import StarIcons from "./Stars";
import CommentForm from "./CommentForm.jsx";

import "./LightBox.css";

const LightBox = () => {
  const { index } = useParams();
  const indexNum = parseInt(index, 10);
  const validIndex = indexNum >= 0 ? indexNum : 0;

  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  console.log(`show: ${show}`);

  const basePath = location.pathname.replace(/\/\d+$/, "");
  console.log(`basePath: ${basePath}`);

  const [category, setCategory] = useState("");
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    if (basePath === "/pictures/photo-of-the-month") {
      setCategory("monthly");
    } else if (basePath === "/pictures/mammals") {
      return setCategory("mammals");
    } else if (basePath === "/pictures/landscapes") {
      return setCategory("landscapes");
    } else if (basePath === "/pictures/nature") {
      return setCategory("nature");
    } else if (basePath === "/pictures/birds") {
      return setCategory("birds");
    }
  }, [basePath]);

  console.log(`category: ${category}`);

  const { isActive, startTimer, stopTimer } = useTimer();
  const { isLoading, isError, picturesByCategory, setPicturesByCategory } =
    usePicturesByCategory(category);

  useEffect(() => {
    if (!isLoading) {
      if (picturesByCategory[validIndex]?.description === "") {
        setIsText(false);
        return;
      } else {
        setIsText(true);
        return;
      }
    }
  }, [isLoading, picturesByCategory, validIndex]);

  console.log(
    `pictures lenght: ${JSON.stringify(
      picturesByCategory.length
    )} AND ${JSON.stringify(picturesByCategory)}`
  );
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

  const nextUrl =
    validIndex === picturesByCategory.length - 1
      ? `${basePath}/${0}`
      : `${basePath}/${validIndex + 1}`;

  const prevUrl =
    validIndex === 0
      ? `${basePath}/${picturesByCategory.length - 1}`
      : `${basePath}/${validIndex - 1}`;

  const handleNavigateNext = () => {
    navigate(nextUrl);
    if (zoomed > 1) {
      handleZoomOut();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading pictures</div>;
  if (!picturesByCategory.length) return <div>No pictures found</div>;

  return (
    <div>
      <div
        key={validIndex}
        className={`lightBoxBC ${isActive ? "slideShow" : ""}`}
      >
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
          isText={isText}
          setPicturesByCategory={setPicturesByCategory}
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
            src={picturesByCategory[validIndex].src}
            alt={picturesByCategory[validIndex].src}
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
          picture={picturesByCategory[validIndex]}
          openItem={openItem}
          toggleItem={toggleItem}
          setShow={setShow}
          setEdit={setEdit}
          setReply={setReply}
          setCurrentComment={setCurrentComment}
        />
        <LightboxText
          picture={picturesByCategory[validIndex]}
          openItem={openItem}
          toggleItem={toggleItem}
        />
      </div>
      <div className="stars">
        <StarIcons id={picturesByCategory[validIndex].id} />
      </div>
      <CommentForm
        show={show}
        setShow={setShow}
        pictureId={picturesByCategory[validIndex].id}
        edit={edit}
        setEdit={setEdit}
        reply={reply}
        setReply={setReply}
        currentComment={currentComment}
      />
    </div>
  );
};

export default LightBox;
