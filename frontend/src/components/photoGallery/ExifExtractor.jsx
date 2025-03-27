import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";

import exifr from "exifr";
import PropTypes from "prop-types";

import LensIcon from "/src/assets/lens-white.png";
import CameraIcon from "/src/assets/camera-white.png";
import LenghtIcon from "/src/assets/lenght-white.png";
import ShutterIcon from "/src/assets/shutter-white.png";
import FstopIcon from "/src/assets/fstop-white.png";
import IsoIcon from "/src/assets/iso-white.png";
import TimeIcon from "/src/assets/time-white.png";

import "./ExifExtractor.css";

const ImageMetadata = ({ src }) => {
  const { language } = useLanguage();

  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (src) {
        try {
          const data = await exifr.parse(src);
          setMetadata(data);
        } catch (error) {
          console.error("Error reading EXIF data:", error);
        }
      }
    };

    fetchMetadata();
  }, [src]);

  console.log(`metadata: ${JSON.stringify(metadata)}`);

  return (
    <div className="exifText">
      <div className="exifHeader">
        <h3>
          {language === "fin"
            ? "Kuvan tekniset tiedot:"
            : "Pictures technical data:"}
        </h3>
      </div>
      {metadata?.Model &&
      metadata?.ExposureTime &&
      metadata?.FNumber &&
      metadata?.ISO &&
      metadata?.LensModel &&
      metadata?.FocalLength &&
      metadata?.DateTimeOriginal ? (
        <div>
          <div className="iconExifText">
            <img className="iconExif" src={CameraIcon} alt="camera-iconExif" />
            {metadata.Make === "SONY" ? `${metadata.Make} ` : ""}
            {metadata.Model}
          </div>
          <div className="iconExifText">
            <img
              className="iconExif"
              src={ShutterIcon}
              alt="shutterspeed-iconExif"
            />
            1/{Math.round(1 / metadata.ExposureTime)} s
          </div>
          <div className="iconExifText">
            <img className="iconExif" src={FstopIcon} alt="fstop-iconExif" />
            f/{metadata.FNumber}
          </div>
          <div className="iconExifText">
            <img className="iconExif" src={IsoIcon} alt="iso-iconExif" /> ISO{" "}
            {metadata.ISO}
          </div>
          <div className="iconExifText">
            <img className="iconExif" src={LensIcon} alt="lens-iconExif" />
            {metadata.LensModel}
          </div>
          <div className="iconExifText">
            <img
              className="iconExif"
              src={LenghtIcon}
              alt="focal-lenght-iconExif"
            />
            @ {metadata.FocalLength} mm
          </div>
          <div className="iconExifText">
            <img className="iconExif" src={TimeIcon} alt="date-iconExif" />
            {new Date(metadata.DateTimeOriginal).toLocaleString(
              language === "fin" ? "fi-FI" : "en-EN"
            )}
          </div>
        </div>
      ) : (
        <div className="iconExifText">
          {language === "fin"
            ? "Tekniset tiedot puuttuva"
            : "No technical data"}
        </div>
      )}
    </div>
  );
};

ImageMetadata.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImageMetadata;
