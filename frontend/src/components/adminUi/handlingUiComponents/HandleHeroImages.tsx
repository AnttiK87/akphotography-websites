import { useState } from "react";
import { useImageIndex } from "../../../hooks/useImageIndex";

import ChangePicture from "./ChangePicture.js";

import "./HandleHeroImages.css";

const HandleHeroImages = () => {
  const [selectedPicture, setSelectedPicture] = useState<string>("");
  const { images } = useImageIndex();
  const [showChangePic, setShowChangePic] = useState(false);

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
            images.map((image) => (
              <option key={image} value={image}>
                {image}
              </option>
            ))
          ) : (
            <option value="">Lataus epäonnistui</option>
          )}
        </select>
        {selectedPicture && (
          <img
            className="selectedImage"
            src={`/images/homeBackground/${selectedPicture}`}
            alt="selected picture"
          />
        )}
        <div className="EditButtonsOP">
          {selectedPicture && (
            <button
              className="button-primary"
              onClick={() => setShowChangePic(true)}
            >
              Change picture
            </button>
          )}
          <button
            className="button-primary"
            onClick={() => setShowChangePic(true)}
          >
            Add new picture
          </button>
        </div>
      </div>
      <ChangePicture
        show={showChangePic}
        setShow={setShowChangePic}
        selectedPicture={selectedPicture}
        picturesCount={images?.length}
        aspect={16 / 9}
      />
    </>
  );
};

export default HandleHeroImages;
