import React from "react";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useRedux.js";
import { showMessage } from "../../reducers/messageReducer.js";

import { Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { changeProfPicture } from "../../reducers/userReducer.js";

import { handleOverlayClose } from "../../utils/closeOverlay.js";
import { optimizeImage } from "../../utils/optimizer.js";

import FileUpload from "./FileUpload.js";

import Cropping from "./handlingUiComponents/Cropping.js";

import type { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import "./EditPicture.css";
import "./OwnProfile.css";

type ChangeProfilePictureProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  setVersion: (value: number) => void;
};

const ChangeProfilePicture = ({
  show,
  setShow,
  setVersion,
}: ChangeProfilePictureProps) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [crop, setCrop] = useState<Crop>();

  const dispatch = useAppDispatch();

  const reset = () => {
    setFile(undefined);
    setPreview(undefined);
  };

  const handleClose = () => {
    setShow(false);
    reset();
  };

  function getCroppedImg(
    image: HTMLImageElement,
    crop: Crop,
    fileName = "cropped.webp"
  ) {
    return new Promise<File | null>((resolve) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // FIX: canvas must be full-resolution in natural pixels
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const file = new File([blob], fileName, { type: "image/webp" });
        resolve(file);
      }, "image/webp");
    });
  }

  const changeProfilePicture = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!image) {
      dispatch(
        showMessage(
          { text: "You haven't added picture yet!", type: "error" },
          3
        )
      );
      return;
    }

    if (!crop) {
      dispatch(
        showMessage(
          { text: "You haven't cropped picture yet!", type: "error" },
          3
        )
      );
      return;
    }

    const croppedPicture = await getCroppedImg(image, crop);

    if (!croppedPicture) {
      dispatch(showMessage({ text: "Cropping failed", type: "error" }, 3));
      return;
    }

    const optimized = await optimizeImage(croppedPicture, 300, 1);

    const formData = new FormData();
    formData.append("image", optimized);

    await dispatch(changeProfPicture(formData));

    setVersion(Date.now());
    handleClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div
      id="closeModal"
      className="editOverlay"
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
    >
      <div id="modal" className="editPictureContainer profilePictureContainer">
        <div className="editPicture">
          <div className="mainHeaderEKW">
            <h3>Change picture:</h3>
            <div onClick={() => handleClose()}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>
          <Form
            onSubmit={changeProfilePicture}
            encType="multipart/form-data"
            className="formContainerEP"
          >
            <div className="form__group input">
              {!preview && (
                <div className="addProfPic">
                  <label htmlFor="addNewProfilePicture" className="form__label">
                    Add new picture
                  </label>

                  <FileUpload
                    setFile={setFile}
                    file={file}
                    setPreview={setPreview}
                  />
                </div>
              )}
              {preview && (
                <Cropping
                  crop={crop}
                  setCrop={setCrop}
                  aspect={1 / 1}
                  preview={preview}
                  setImage={setImage}
                  circularCrop={true}
                />
              )}
            </div>

            <div className="commentButtons">
              {preview && (
                <>
                  <Button
                    variant="danger"
                    className="button-primary delButton"
                    onClick={reset}
                  >
                    Clear
                  </Button>{" "}
                  <Button
                    variant="primary"
                    className="button-primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </>
              )}
              {!preview && (
                <Button
                  variant="danger"
                  className="button-primary delButton"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;
