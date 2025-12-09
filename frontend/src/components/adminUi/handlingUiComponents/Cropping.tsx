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
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const width = img.width;
    const height = img.height;

    const imgAspect = width / height;

    let cropWidth: number;
    let cropHeight: number;

    // Circle = square crop
    if (circularCrop) {
      const size = Math.min(width, height);
      cropWidth = size;
      cropHeight = size;
    } else {
      // normal crop
      if (imgAspect > aspect) {
        // image is wider → limit width
        cropWidth = height * aspect;
        cropHeight = height;
      } else {
        // image is taller → limit height
        cropWidth = width;
        cropHeight = width / aspect;
      }
    }

    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    setCrop({
      unit: "px",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
    });
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
