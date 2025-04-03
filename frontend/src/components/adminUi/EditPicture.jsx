//component for rendering form for adding blogs

//dependencies
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { editPicture } from "../../reducers/pictureReducer.js";
import { initializeComments, remove } from "../../reducers/commentReducer.js";
import { initializeKeywords } from "../../reducers/keywordReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import AdminReplies from "./AdminReplies.jsx";
import StarRating from "./StarsAdmin.jsx";
import CommentForm from "../photoGallery/CommentForm.jsx";

import "./EditPicture.css";

const EditPicture = ({ show, setShow, picture }) => {
  const dispatch = useDispatch();

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [reply, setReply] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  const [type, setType] = useState("");
  const [textFi, setTextFi] = useState("");
  const [textEn, setTextEn] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [keywordArray, setKeywordArray] = useState(
    () => picture?.keywords?.map((keyword) => String(keyword?.keyword)) || []
  );
  const initialKeywords =
    picture?.keywords?.map((keyword) => String(keyword?.keyword)) || [];

  useEffect(() => {
    dispatch(initializeKeywords());
  }, [dispatch, show]);

  const keywords = useSelector((state) =>
    state.keywords.keywords.map((keyword) => String(keyword.keyword))
  );

  //console.log(`all keywords: ${JSON.stringify(keywords)}`);
  //console.log(`pictures keywords: ${JSON.stringify(picture.keywords)}`);
  //console.log(`keywords array: ${JSON.stringify(keywordArray)}`);
  //console.log(`keywords initial: ${JSON.stringify(initialKeywords)}`);

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

  //console.log(`picture ${JSON.stringify(picture)}`);

  useEffect(() => {
    if (picture && show) {
      setTextFi;
      setType(picture.type);
      setTextFi(picture.text?.textFi);
      setTextEn(picture.text?.textEn);
      const YearMonth = picture?.month_year;
      setKeywordArray(
        Array.from(picture?.keywords.map((keyword) => String(keyword?.keyword)))
      );

      setYear(Number(YearMonth?.toString().slice(0, 4)) || "");
      setMonth(Number(YearMonth?.toString().slice(-2)) || "");
      dispatch(initializeComments(picture.id));
    }
  }, [picture, dispatch, show]);

  const comments = useSelector((state) => state.comments.comments);

  const deleteComment = (comment) => {
    if (window.confirm(`Do you really want to delete this comment?`)) {
      dispatch(remove({ comment }));
    }
    return;
  };

  const reset = () => {
    setType(picture.type);
    setTextFi(picture.text?.textFi || "");
    setTextEn(picture.text?.textEn || "");
    const YearMonth = picture?.month_year;
    setYear(Number(YearMonth?.toString().slice(0, 4)) || "");
    setMonth(Number(YearMonth?.toString().slice(-2)) || "");
    setKeywordArray(
      picture?.keywords?.map((keyword) => String(keyword?.keyword)) || []
    );
  };

  const clear = () => {
    setType("");
    setTextFi("");
    setTextEn("");
    setMonth("");
    setYear("");
    setKeywordArray([]);
  };

  const areKeywordsEqual = (keywords1, keywords2) => {
    if (keywords1.length !== keywords2.length) return false; // Jos eri pituus, eivät voi olla samat
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    return (
      keywords1.every((item) => set2.has(item)) &&
      keywords2.every((item) => set1.has(item))
    );
  };

  const handleEditPicture = (event) => {
    event.preventDefault();
    const pictureId = picture.id;

    //console.log(`id: ${pictureId}`);

    if (!pictureId) {
      console.error("No picture found!");
      return;
    }

    const typeValue = event.target.elements?.type?.value;

    const yearValue =
      typeValue != "monthly" ? null : event.target.elements?.year?.value;
    const monthValue =
      typeValue != "monthly" ? null : event.target.elements?.month?.value;
    const textFiValue =
      event.target.elements?.textFi?.value === ""
        ? null
        : event.target.elements?.textFi?.value;
    const textEnValue =
      event.target.elements?.textEn?.value === ""
        ? null
        : event.target.elements?.textEn?.value;

    const newKeywordsSet = areKeywordsEqual(keywordArray, initialKeywords)
      ? null
      : keywordArray;

    //console.log(`newkeywords: ${newKeywordsSet}`);

    const formData = {
      type: typeValue,
      textFi: textFiValue,
      textEn: textEnValue,
      keywords: newKeywordsSet,
      month: monthValue,
      year: yearValue,
    };

    //console.log(`formdata: ${JSON.stringify(formData)}`);
    dispatch(editPicture({ pictureId, formData }));
    handleClose();
  };

  const handleOverlayClose = (event) => {
    if (event.target.id === "closeModal") {
      clear();
      setShow(false);
    }
  };

  const handleClose = () => {
    clear();
    setShow(false);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (type != "monthly") {
      if (year != "" || month != "") {
        setYear("");
        setMonth("");
      }
    }
  };

  const handleTextFiChange = (e) => {
    setTextFi(e.target.value);
  };

  const handleTextEnChange = (e) => {
    setTextEn(e.target.value);
  };

  const handleReplyComment = (comment) => {
    setCurrentComment(comment);
    setShowCommentForm(true);
    setReply(true);
  };

  if (!show) {
    return null;
  }

  return (
    <div id="closeModal" className="editOverlay" onClick={handleOverlayClose}>
      <div id="modal" className="editPictureContainer">
        <div className="editPicture">
          <div className="mainHeaderEP">
            <h3>Edit current picture:</h3>
            <div onClick={() => handleClose()}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>
          <div className="imageContEP">
            <div className="imgAndRatings">
              <img
                className="imageForEditPicture"
                src={picture.url}
                alt={picture.fileName}
              />
              <div className="raitingsContainerEP">
                <h4 className="ratingsHeaderEP">Ratings:</h4>
                <StarRating ratings={picture.ratings} bars={true} />
              </div>
            </div>
            <div>
              <h4 className="headerEP">Picture info:</h4>
              <p className="textAddedEP">
                Picture added:{" "}
                <b>{new Date(picture.uploadedAt).toLocaleString()}</b>
              </p>
              <p className="textAddedEP">
                Filename: <b>{picture.fileName}</b>
              </p>
              <p className="textAddedEP">
                URL: <b>{picture.url}</b>
              </p>
              <p className="textAddedEP">
                Views: <b>{picture.viewCount}</b>
              </p>
            </div>
          </div>
          <Form
            onSubmit={handleEditPicture}
            encType="multipart/form-data"
            className="formContainerEP"
          >
            <div className="form__group input">
              <div className="form__group input">
                <label htmlFor="type" className="form__label">
                  Type:
                </label>
                <select
                  className="form__field"
                  id="type"
                  name="type"
                  required
                  value={type}
                  onChange={handleTypeChange}
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
              {type === "monthly" && (
                <div className="divYearMonthEP">
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
              )}

              <div className="form__group input">
                <label htmlFor="textFi" className="form__label">
                  Finnish text:
                </label>
                <textarea
                  className="form__field"
                  id="textFi"
                  name="textFi"
                  value={textFi}
                  onChange={handleTextFiChange}
                  placeholder={!textFi ? "add finnish text..." : textFi}
                  rows="4"
                />
              </div>

              <div className="form__group input">
                <label htmlFor="textEn" className="form__label">
                  English text:
                </label>
                <textarea
                  className="form__field"
                  id="textEn"
                  name="textEn"
                  value={textEn}
                  onChange={handleTextEnChange}
                  placeholder={!textEn ? "add english text..." : textEn}
                  rows="4"
                />
              </div>
            </div>
            <label htmlFor="textEn" className="form__label">
              Keywords:
            </label>
            <Autocomplete
              sx={{
                width: 500,
                maxWidth: "100%",
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc", // Hover border color
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black", // Active (focused) border color
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
                setKeywordArray(newValue); // 🔹 Tallentaa valitut arvot
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

            <div className="commentButtons">
              <button className="button-primary" type="submit">
                Save Edits
              </button>
              <button
                className="button-primary  delButton"
                type="button"
                onClick={reset}
              >
                Reset All
              </button>
              <button
                className="button-primary  delButton"
                type="button"
                onClick={clear}
              >
                Clear All
              </button>
            </div>
          </Form>

          <h4 className="HeadeCommentsEP">Comments of this picture:</h4>

          <div className="CommentsContainerEP">
            {comments.length === 0 ? (
              <div>No added comments.</div>
            ) : (
              comments.map((comment, index) => (
                <div
                  className="EPCommentAndRelies"
                  key={`commentId-${comment.id}`}
                >
                  <div className="EditPictureComment">
                    <div>{index + 1}. </div>
                    <div>
                      <div>
                        Username: <b>{comment.username}</b> added comment:{" "}
                        <b>{comment.comment}</b>
                      </div>
                      <div>
                        Comment added:{" "}
                        <b>{new Date(comment.updatedAt).toLocaleString()}</b>
                        {comment.updatedAt > comment.createdAt ? (
                          <>
                            {" "}
                            and edited:{" "}
                            <b>
                              {new Date(comment.updatedAt).toLocaleString()}
                            </b>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="iconDeleteContEP">
                      <FontAwesomeIcon
                        className="iconDeleteEP"
                        icon={faTrash}
                        onClick={() => deleteComment(comment)}
                      />
                      <div
                        onClick={() => handleReplyComment(comment)}
                        className="answerText"
                      >
                        Reply
                      </div>
                    </div>
                  </div>
                  <div>
                    <AdminReplies
                      pictureId={picture.id}
                      commentId={comment.id}
                      handleReplyComment={handleReplyComment}
                    />
                  </div>
                  <CommentForm
                    show={showCommentForm}
                    setShow={setShowCommentForm}
                    pictureId={picture.id}
                    reply={reply}
                    setReply={setReply}
                    currentComment={currentComment}
                    adminComment={true}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EditPicture.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  picture: PropTypes.object,
};

export default EditPicture;
