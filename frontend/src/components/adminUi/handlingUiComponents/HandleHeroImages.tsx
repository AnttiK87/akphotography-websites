import { useState, useEffect } from "react";

import { showMessage } from "../../../reducers/messageReducer.js";
import { useAppDispatch } from "../../../hooks/useRedux.js";
import uiComponentService from "../../../services/uiComponents.js";

import type { AxiosError } from "axios";
import { handleError } from "../../../utils/handleError";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import ChangePicture from "./ChangePicture.js";

import "./HandleHeroImages.css";

type HandleHeroImagesProps = {
  view: {
    view: string;
    pathHero: string | undefined;
    pathContent: string | undefined;
    pathCard: string | undefined;
  };
};

const HandleHeroImages = ({ view }: HandleHeroImagesProps) => {
  const dispatch = useAppDispatch();

  const [selectedPicture, setSelectedPicture] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [showChangePic, setShowChangePic] = useState(false);
  const [version, setVersion] = useState(Date.now());

  useEffect(() => {
    async function fetchPictures() {
      if (view.pathHero === undefined) return;
      const data = await uiComponentService.getPictures(view.pathHero);
      setImages(data.files);
    }

    fetchPictures();
  }, [view.pathHero]);

  const deleteImg = async () => {
    if (window.confirm(`Do you really want to delete this picture?`)) {
      try {
        if (view.pathHero === undefined) {
          dispatch(
            showMessage(
              {
                text: "Unknown path!",
                type: "error",
              },
              5
            )
          );

          return;
        }

        const data: { path: string; filename: string } = {
          path: view.pathHero,
          filename: selectedPicture,
        };

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

  if (view.pathHero === undefined) return null;

  return (
    <>
      <div className="handle-hero">
        <h4>Change hero images on {view.view} screen</h4>
        <div className="heroImages">
          {images ? (
            images
              ?.sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ""), 10);
                const numB = parseInt(b.replace(/\D/g, ""), 10);
                return numA - numB;
              })
              .map((image) => (
                <div
                  className="heroItem"
                  onClick={() =>
                    selectedPicture === image
                      ? setSelectedPicture("")
                      : setSelectedPicture(image)
                  }
                  key={image}
                >
                  <img
                    className="heroImage"
                    src={`/uploads${view.pathHero}${image}?t=${version}`}
                    alt="selected picture"
                  />
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
        {selectedPicture && images && (
          <div className="imageAndDel">
            <img
              className="selectedImage"
              src={`/uploads${view.pathHero}${selectedPicture}?t=${version}`}
              alt="selected picture"
            />
            {images?.length > 1 && (
              <button className="deleteBtn" onClick={() => deleteImg()}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
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
          {!selectedPicture && images.length < 10 && (
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
        path={view.pathHero}
        setVersion={setVersion}
      />
    </>
  );
};

export default HandleHeroImages;
