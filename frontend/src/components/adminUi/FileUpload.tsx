import React from "react";
import { useState } from "react";
import "./FileUpload.css";

import { useAppDispatch } from "../../hooks/useRedux.js";
import { showMessage } from "../../reducers/messageReducer";

type FileUploadProps = {
  setFile: (file: File) => void;
  file: File | undefined;
};

const FileUpload = ({ setFile, file }: FileUploadProps) => {
  const dispatch = useAppDispatch();
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const isJpg =
        droppedFile.type === "image/jpeg" ||
        droppedFile.name.toLowerCase().endsWith(".jpg");

      if (isJpg) {
        setFile(droppedFile);
      } else {
        dispatch(
          showMessage(
            { text: "Only .jpg files are allowed.", type: "error" },
            3
          )
        );
      }
    }
  };

  return (
    <div
      className={`form__group input drop-zone ${
        dragActive ? "drag-active" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label htmlFor="image" className="form__label">
        Add picture (Drag & Drop or Click)
      </label>
      <input
        className="form__field"
        type="file"
        id="image"
        name="image"
        onChange={handleFileChange}
        style={{ visibility: "hidden", position: "absolute" }}
        accept=".jpg"
      />
      <div
        className="drop-area"
        onClick={() => document.getElementById("image")?.click()}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <>
            <p>Drag a file here or click to select one</p>
            <p>(use only .jpg files)</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
