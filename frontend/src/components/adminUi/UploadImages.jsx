//component for rendering form for adding blogs
import { useState } from "react";

//dependencies
import { useDispatch } from "react-redux";
import { createPicture } from "../../reducers/pictureReducer.js";
import { Form, Button } from "react-bootstrap";

import FileUpload from "./FileUpload.jsx";

import "./UploadImages.css";

const UploadImages = () => {
  const [file, setFile] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [textFi, setTextFi] = useState("");
  const [textEn, setTextEn] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const availableMonths = Array.from(
    { length: year == currentYear ? currentMonth : 12 },
    (_, i) => ({
      value: i + 1,
      name: monthNames[i], // Haetaan nimi listasta
    })
  );

  const availableYears = Array.from(
    { length: currentYear - 2020 + 1 }, // Lisätään 1, jotta 2020 tulee mukaan
    (_, i) => ({
      value: 2020 + i, // 2020 + indeksi
    })
  );

  const dispatch = useDispatch();

  const reset = () => {
    setSelectedType("");
    setFile(null);
    setMonth("");
    setYear("");
    setTextFi("");
    setTextEn("");
  };

  // function for sending form content and calling createBlog
  const addPicture = (event) => {
    event.preventDefault();

    const { type } = event.target.elements;
    const image = file;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", type.value);

    if (selectedType === "monthly") {
      formData.append("month", month);
      formData.append("year", year);
      formData.append("textFi", textFi);
      formData.append("textEn", textEn);
    }

    dispatch(createPicture(formData));

    reset();
  };

  // rendering the form
  return (
    <div className="marginAddImage">
      <h3>Add new picture</h3>
      <Form onSubmit={addPicture} encType="multipart/form-data">
        <FileUpload setFile={setFile} file={file} />
        <div className="form__group input">
          <label htmlFor="type" className="form__label">
            Select type
          </label>
          <select
            className="form__field"
            id="type"
            name="type"
            required
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="nature">Nature</option>
            <option value="birds">Birds</option>
            <option value="landscapes">Landscapes</option>
            <option value="mammals">Mammals</option>
            <option value="monthly">Monthly Picture</option>
          </select>
        </div>

        {selectedType === "monthly" && (
          <>
            <h5 className="monthly">
              Add information for the Photo of the Month
            </h5>
            <div>
              <div className="divYearMonth">
                <div className="form__group year">
                  <label htmlFor="year" className="form__label">
                    Year
                  </label>
                  <select
                    className="form__field"
                    id="year"
                    name="year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                  >
                    <option value="">Select year</option>
                    {availableYears.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form__group month">
                  <label htmlFor="month" className="form__label">
                    Month
                  </label>
                  <select
                    className="form__field"
                    id="month"
                    name="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  >
                    <option value="">Select month</option>
                    {availableMonths.map(({ value, name }) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form__group input">
                <label htmlFor="textEn" className="form__label">
                  Finnish text for photo of the month
                </label>
                <textarea
                  className="form__field"
                  id="textFi"
                  name="textFi"
                  value={textFi}
                  onChange={(e) => setTextFi(e.target.value)}
                  placeholder="Enter finnish text here..."
                  required
                  rows="4"
                />
              </div>
              <div className="form__group input">
                <label htmlFor="textEn" className="form__label">
                  English text for photo of the month
                </label>
                <textarea
                  className="form__field"
                  id="textEn"
                  name="textEn"
                  value={textEn}
                  onChange={(e) => setTextEn(e.target.value)}
                  placeholder="Enter english text here..."
                  required
                  rows="4"
                />
              </div>
            </div>
          </>
        )}
        <div className="buttonDiv">
          <Button variant="danger" className="button-primary" onClick={reset}>
            Clear All
          </Button>
          <Button variant="primary" className="button-primary" type="submit">
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UploadImages;
