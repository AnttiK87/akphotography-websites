import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";

import { useAppDispatch } from "../../hooks/useRedux.js";
import {
  movePictureUp,
  movePictureDown,
} from "../../reducers/pictureReducer.js";

import type { PictureDetails } from "../../types/pictureTypes.js";

type OrderChangeProps = {
  picture: PictureDetails;
  maxOrder: number | null;
};

const OrderChange = ({ picture, maxOrder }: OrderChangeProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const orderUp = (pictureId: number) => {
    dispatch(movePictureUp(pictureId, navigate));
  };

  const orderDown = (pictureId: number) => {
    dispatch(movePictureDown(pictureId, navigate));
  };

  return (
    <>
      {picture.order === 0 && (
        <FontAwesomeIcon
          className="orderIcon"
          icon={faArrowCircleUp}
          onClick={() => orderUp(picture.id)}
        />
      )}
      {picture.order != maxOrder && (
        <FontAwesomeIcon
          className="orderIcon"
          icon={faArrowCircleUp}
          onClick={() => orderUp(picture.id)}
        />
      )}
      {picture.order && picture.order !== 1 && (
        <FontAwesomeIcon
          className="orderIcon"
          icon={faArrowCircleDown}
          onClick={() => orderDown(picture.id)}
        />
      )}
    </>
  );
};

export default OrderChange;
