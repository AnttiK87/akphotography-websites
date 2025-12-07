import { useState } from "react";
import { useImageIndex } from "../../../hooks/useImageIndex";

import { showMessage } from "../../../reducers/messageReducer.js";
import { useAppDispatch } from "../../../hooks/useRedux.js";
import uiComponentService from "../../../services/uiComponents.js";

import type { AxiosError } from "axios";
import { handleError } from "../../../utils/handleError";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import ChangePicture from "./ChangePicture.js";
import type { UploadFn } from "../../../types/uiComponentTypes";

import "./HandleHeroImages.css";

type HandleHeroImagesProps = {
  upload: UploadFn;
};

const HandleHeroImages = ({ upload }: HandleHeroImagesProps) => {
  const dispatch = useAppDispatch();

  const [selectedPicture, setSelectedPicture] = useState<string>("");
  const { images, setImages } = useImageIndex();
  const [showChangePic, setShowChangePic] = useState(false);
  const [version, setVersion] = useState(Date.now());
  const path = "/images/homeBackground/";

  const deleteImg = async () => {
    if (window.confirm(`Do you really want to delete this picture?`)) {
      try {
        const data = { path: path, filename: selectedPicture };

        const response = await uiComponentService.deletePic(data);

        dispatch(
          showMessage(
            {
              text: response.messageEn,
              type: "success",
            },
            5
          )
        );

        if (images) {
          setImages(images.filter((pic) => pic !== selectedPicture));
        }

        setSelectedPicture("");
      } catch (err: unknown) {
        const error = err as AxiosError;
        handleError(error, dispatch);
      }
    }
    return;
  };

  return (
    <>
      <div className="handle-hero">
        <h4>Change home screen hero images</h4>
        <select
          value={selectedPicture}
          onChange={(e) => setSelectedPicture(e.target.value)}
        >
          <option value="">Choose picture</option>
          {images ? (
            images
              ?.sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ""), 10);
                const numB = parseInt(b.replace(/\D/g, ""), 10);
                return numA - numB;
              })
              .map((image) => (
                <option key={image} value={image}>
                  {image}
                </option>
              ))
          ) : (
            <option value="">Lataus epäonnistui</option>
          )}
        </select>
        {selectedPicture && (
          <div className="imageAndDel">
            <img
              className="selectedImage"
              src={`/images/homeBackground/${selectedPicture}?t=${version}`}
              alt="selected picture"
            />
            <button className="deleteBtn" onClick={() => deleteImg()}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
        <div className="EditButtonsOP">
          {selectedPicture && (
            <>
              <button
                className="button-primary"
                onClick={() => setShowChangePic(true)}
              >
                Change picture
              </button>
              <button
                className="button-primary"
                onClick={() => setSelectedPicture("")}
              >
                Clear
              </button>
            </>
          )}
          {!selectedPicture && (
            <button
              className="button-primary"
              onClick={() => setShowChangePic(true)}
            >
              Add new picture
            </button>
          )}
        </div>
      </div>
      <ChangePicture
        show={showChangePic}
        setShow={setShowChangePic}
        selectedPicture={selectedPicture}
        pictures={images}
        aspect={16 / 9}
        path={path}
        setVersion={setVersion}
        onUpload={upload}
      />
    </>
  );
};

export default HandleHeroImages;
