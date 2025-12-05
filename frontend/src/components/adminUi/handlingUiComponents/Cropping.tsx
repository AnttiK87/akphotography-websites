import React from "react";

import ReactCrop from "react-image-crop";
import type { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type CroppingProps = {
  crop: Crop | undefined;
  setCrop: (value: Crop) => void;
  aspect: number;
  preview: string | undefined;
  setImage: (value: HTMLImageElement | undefined) => void;
  circularCrop: boolean;
};

const Cropping = ({
  crop,
  setCrop,
  aspect,
  preview,
  setImage,
  circularCrop,
}: CroppingProps) => {
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const img = e.currentTarget;
    const width = img.width;
    const height = img.height;

    const size = Math.min(width, height);

    const portrait = height > width;

    const aspectHeight = width / aspect;

    const offset_y =
      portrait && circularCrop
        ? (height - width) / 2
        : !circularCrop
        ? (height - aspectHeight) / 2
        : 0;
    const offset_x = !portrait && circularCrop ? (width - height) / 2 : 0;

    const crop: Crop = {
      unit: "px",
      x: offset_x,
      y: offset_y,
      width: circularCrop ? size : width,
      height: circularCrop ? size : aspectHeight,
    };

    setCrop(crop);
  }

  return (
    <div className="preview">
      Crop:
      <ReactCrop
        crop={crop}
        aspect={aspect}
        circularCrop={circularCrop}
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
  );
};

export default Cropping;
