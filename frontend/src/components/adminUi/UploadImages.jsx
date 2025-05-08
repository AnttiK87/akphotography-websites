import { useState, useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { createPicture } from "../../reducers/pictureReducer.js";
import { initializeKeywords } from "../../reducers/keywordReducer.js";

import { Form, Button } from "react-bootstrap";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import FileUpload from "./FileUpload.jsx";

import useNotLoggedin from "../../hooks/useNotLoggedin.js";
import NotLoggedin from "./NotLoggedin.jsx";
import { showMessage } from "../../reducers/messageReducer";

import "./UploadImages.css";

const UploadImages = () => {
  const { user } = useNotLoggedin();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [textFi, setTextFi] = useState("");
  const [textEn, setTextEn] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywordArray, setKeywordArray] = useState([]);
  const [addText, setAddText] = useState(false);

  useEffect(() => {
    dispatch(initializeKeywords());
  }, [dispatch]);

  const rawKeywords = useSelector((state) => state.keywords.keywords);

  const keywords = useMemo(
    () => rawKeywords.map((keyword) => String(keyword.keyword)),
    [rawKeywords]
  );

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
      name: monthNames[i],
    })
  );

  const availableYears = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => ({
      value: 2020 + i,
    })
  );

  if (keywordArray.includes(keyword)) {
    setKeywordArray(keywordArray.filter((kw) => kw !== keyword));
  }

  const reset = () => {
    setSelectedType("");
    setFile(null);
    setMonth(null);
    setYear(null);
    setTextFi("");
    setTextEn("");
    setKeyword("");
    setKeywordArray([]);
    setAddText(false);
  };

  const handleHideText = () => {
    setAddText(false);
    setTextFi("");
    setTextEn("");
  };

  const addPicture = (event) => {
    event.preventDefault();

    if (!file) {
      dispatch(
        showMessage(
          { text: "You haven't added picture yet!", type: "error" },
          3
        )
      );
      return;
    }

    const { type } = event.target.elements;
    const image = file;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", type.value);
    formData.append("keywords", keywordArray);

    if (selectedType === "monthly") {
      formData.append("month", Number(month));
      formData.append("year", Number(year));
      formData.append("textFi", textFi);
      formData.append("textEn", textEn);
    } else if (textFi || textEn) {
      formData.append("textFi", textFi);
      formData.append("textEn", textEn);
    }

    dispatch(createPicture(formData)).then(() => {
      dispatch(initializeKeywords());
    });

    reset();
  };

  if (!user) {
    return <NotLoggedin />;
  }

  return (
    <div className="marginAddImage">
      <h3>Add new picture</h3>
      <Form onSubmit={addPicture} encType="multipart/form-data">
        <FileUpload setFile={setFile} file={file} />
        <div className="ComboBoxUI">
          <label htmlFor="tags-outlined">Keywords:</label>
          <Autocomplete
            sx={{
              width: 500,
              maxWidth: "100%",
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ccc",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
              },
            }}
            multiple
            id="tags-outlined"
            options={keywords.sort(
              (a, b) =>
                -b
                  .charAt(0)
                  .toUpperCase()
                  .localeCompare(a.charAt(0).toUpperCase())
            )}
            getOptionLabel={(keyword) => String(keyword)}
            groupBy={(keyword) => keyword.charAt(0).toUpperCase()}
            value={keywordArray}
            filterSelectedOptions
            freeSolo
            onChange={(event, newValue) => {
              setKeywordArray(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    sx={{
                      backgroundColor: "#f8f7f5",
                    }}
                    variant="outlined"
                    label={option}
                    key={key}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Add keywords" />
            )}
          />
        </div>
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
        {selectedType != "monthly" && addText && (
          <>
            <h5 className="monthly">Add additional information</h5>
            <div>
              <div className="form__group input">
                <label htmlFor="textEn" className="form__label">
                  {"Finnish text (optional)"}
                </label>
                <textarea
                  className="form__field"
                  id="textFi"
                  name="textFi"
                  value={textFi}
                  onChange={(e) => setTextFi(e.target.value)}
                  placeholder="Enter finnish text here..."
                  rows="4"
                />
              </div>
              <div className="form__group input">
                <label htmlFor="textEn" className="form__label">
                  {"English text (optional)"}
                </label>
                <textarea
                  className="form__field"
                  id="textEn"
                  name="textEn"
                  value={textEn}
                  onChange={(e) => setTextEn(e.target.value)}
                  placeholder="Enter english text here..."
                  rows="4"
                />
              </div>
            </div>
          </>
        )}
        <div className="buttonDiv">
          <Button
            variant="danger"
            className="button-primary delButton"
            onClick={reset}
          >
            Clear All
          </Button>
          {selectedType != "monthly" && selectedType != "" && (
            <Button
              variant="primary"
              className="button-primary"
              onClick={
                !addText ? () => setAddText(true) : () => handleHideText()
              }
            >
              {!addText ? "Add text" : "Hide text"}
            </Button>
          )}
          <Button variant="primary" className="button-primary" type="submit">
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UploadImages;
