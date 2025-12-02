import React from "react";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useRedux.js";
import { showMessage } from "../../reducers/messageReducer.js";

import { Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { changeProfPicture } from "../../reducers/userReducer.js";

import { handleOverlayClose } from "../../utils/closeOverlay.js";

import FileUpload from "./FileUpload.js";

import ReactCrop from "react-image-crop";
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

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    const width = img.width;
    const height = img.height;

    const size = Math.min(width, height);

    const portrait = height > width;

    const offset_y = portrait ? (height - width) / 2 : 0;
    const offset_x = !portrait ? (width - height) / 2 : 0;

    const crop: Crop = {
      unit: "px",
      x: offset_x,
      y: offset_y,
      width: size,
      height: size,
    };

    setCrop(crop);
  }

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

    const formData = new FormData();
    formData.append("image", croppedPicture);

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
            <h3>Change profile picture:</h3>
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
                    Add new profile picture
                  </label>

                  <FileUpload
                    setFile={setFile}
                    file={file}
                    setPreview={setPreview}
                  />
                </div>
              )}
              {preview && (
                <div className="preview">
                  Crop:
                  <ReactCrop
                    crop={crop}
                    aspect={1 / 1}
                    circularCrop={true}
                    onChange={(c) => setCrop(c)}
                  >
                    <img
                      className="cropPreview"
                      src={preview}
                      alt="crop preview"
                      onLoad={(e) => {
                        onImageLoad(e);
                        setImage(e.currentTarget);
                      }}
                    />
                  </ReactCrop>
                </div>
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
