import { useState } from "react";
import PropTypes from "prop-types";
import "./FileUpload.css";

const FileUpload = ({ setFile, file }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
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
        required
        style={{ display: "none" }}
        accept=".jpg"
      />
      <div
        className="drop-area"
        onClick={() => document.getElementById("image").click()}
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

FileUpload.propTypes = {
  setFile: PropTypes.func.isRequired,
  file: PropTypes.instanceOf(File),
};

export default FileUpload;
