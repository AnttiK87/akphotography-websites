import React from "react";
import { useState } from "react";
import { showMessage } from "../../../reducers/messageReducer.js";
import { showProgress } from "../../../reducers/progressReducer.js";
import { useAppDispatch } from "../../../hooks/useRedux.js";
import uiComponentService from "../../../services/uiComponents.js";
import { optimizeImage } from "../../../utils/optimizer.js";

import type { AxiosError } from "axios";
import { handleError } from "../../../utils/handleError";

import { Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { handleOverlayClose } from "../../../utils/closeOverlay.js";
import FileUpload from "../FileUpload.js";
import Cropping from "./Cropping.js";

import type { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import "../EditPicture.css";
import "../OwnProfile.css";

type ChangePictureProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  selectedPicture: string | undefined;
  pictures: string[] | undefined;
  aspect: number;
  path: string;
  setVersion: (value: number) => void;
};

const ChangePicture = ({
  show,
  setShow,
  selectedPicture,
  pictures,
  aspect,
  path,
  setVersion,
}: ChangePictureProps) => {
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

  const getSmallestFreeIndex = (pictures: string[]) => {
    const set = new Set(
      pictures.map((name) => {
        const m = name.match(/background(\d+)\./);
        return m ? Number(m[1]) : null;
      })
    );

    let i = 1;
    while (set.has(i)) {
      i++;
    }
    return i;
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    fileName = "cropped.jpg"
  ) => {
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

        const file = new File([blob], fileName, { type: "image/jpg" });
        resolve(file);
      }, "image/jpg");
    });
  };

  const changePicture = async (event: React.FormEvent<HTMLFormElement>) => {
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

    const optimized = await optimizeImage(croppedPicture, 700, 1);

    const fileIndex =
      !selectedPicture && pictures && getSmallestFreeIndex(pictures);

    const formData = new FormData();
    formData.append("image", optimized);
    formData.append("path", path);
    formData.append(
      "filename",
      selectedPicture ? selectedPicture : `background${fileIndex}.jpg`
    );

    try {
      const response = await uiComponentService.changePic(
        formData,
        (progress, ms) => {
          dispatch(showProgress({ progress, ms }));
        }
      );

      dispatch(
        showMessage(
          {
            text: response.messageEn,
            type: "success",
          },
          5
        )
      );

      if (pictures && !selectedPicture) {
        pictures.push(response.picture);
      }

      setVersion(Date.now());
      handleClose();
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
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
            <h3>Select picture:</h3>
            <div onClick={() => handleClose()}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>
          <Form
            onSubmit={changePicture}
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
                  aspect={aspect}
                  preview={preview}
                  setImage={setImage}
                  circularCrop={false}
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

export default ChangePicture;
