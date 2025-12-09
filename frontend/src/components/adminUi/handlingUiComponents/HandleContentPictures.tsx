import { useEffect, useState } from "react";

import uiComponentService from "../../../services/uiComponents.js";

import ChangePicture from "./ChangePicture.js";

import "./HandleHeroImages.css";

type HandleContentPicturesProps = {
  view: {
    view: string;
    pathHero: string | undefined;
    pathContent: string | undefined;
    pathCard: string | undefined;
  };
};

const HandleContentPictures = ({ view }: HandleContentPicturesProps) => {
  const [selectedPicture, setSelectedPicture] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [aspect, setAspect] = useState<number>(0);
  const [showChangePic, setShowChangePic] = useState(false);
  const [version, setVersion] = useState(Date.now());

  useEffect(() => {
    async function fetchPictures() {
      if (view.pathContent === undefined) return;
      const data = await uiComponentService.getPictures(view.pathContent);
      setImages(data.files);
    }

    fetchPictures();
  }, [view.pathContent]);

  useEffect(() => {
    if (!selectedPicture) return;

    const image = new Image();
    image.src = `/uploads${view.pathContent}${selectedPicture}`;

    image.onload = () => {
      setAspect(image.naturalWidth / image.naturalHeight);
    };
  }, [selectedPicture, view.pathContent]);

  if (view.pathContent === undefined) return null;

  return (
    <>
      <div className="handle-hero handle-content">
        <h4>Change content images on {view.view} screen</h4>
        <div className="heroImages">
          {images ? (
            images.map((image) => (
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
                  src={`/uploads${view.pathContent}${image}?t=${version}`}
                  alt="selected picture"
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        {selectedPicture && (
          <div className="imageAndDel">
            <img
              className="selectedImage"
              src={`/uploads${view.pathContent}${selectedPicture}?t=${version}`}
              alt="selected picture"
            />
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
        </div>
      </div>
      <ChangePicture
        show={showChangePic}
        setShow={setShowChangePic}
        selectedPicture={selectedPicture}
        pictures={images}
        aspect={aspect}
        path={view.pathContent}
        setVersion={setVersion}
      />
    </>
  );
};

export default HandleContentPictures;
