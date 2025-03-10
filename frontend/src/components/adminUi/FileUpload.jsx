import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./FileUpload.css";

const FileUpload = ({ setFile, file }) => {
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (setFile === null) {
      setDragActive(true);
    }
    if (setFile) {
      setDragActive(false);
    }
  }, [setFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      setFile(file);
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
        style={{ display: "none" }} // Piilotetaan oletus-input
      />
      <div
        className="drop-area"
        onClick={() => document.getElementById("image").click()}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag a file here or click to select one</p>
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
