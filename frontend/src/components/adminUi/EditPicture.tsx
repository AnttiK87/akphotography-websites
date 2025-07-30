//dependencies
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";
import { editPicture } from "../../reducers/pictureReducer.js";
import { initializeComments, remove } from "../../reducers/commentReducer.js";
import { initializeKeywords } from "../../reducers/keywordReducer.js";
import { handleOverlayClose } from "../../utils/closeOverlay.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import AdminReplies from "./AdminReplies.js";
import StarRating from "./StarsAdmin.js";
import CommentForm from "../photoGallery/CommentForm.js";
import useLightBox from "../../hooks/useLightBox.js";

import "./EditPicture.css";

import type { PictureDetails } from "../../types/pictureTypes.js";
import type { Comment, DeleteComment } from "../../types/commentTypes.js";
import type { Reply } from "../../types/replyTypes.js";
import type { Type } from "../../types/types.js";
import { typeCheck } from "../../utils/isValidType.js";

type EditPictureProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  picture: PictureDetails;
};

const EditPicture = ({ show, setShow, picture }: EditPictureProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setCurrentComment } = useLightBox();

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [reply, setReply] = useState(false);

  const [type, setType] = useState<Type>(picture.type);
  const [textFi, setTextFi] = useState<string | undefined>(undefined);
  const [textEn, setTextEn] = useState<string | undefined>(undefined);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [keywordArray, setKeywordArray] = useState(
    () => picture?.keywords?.map((keyword) => String(keyword?.keyword)) || []
  );
  const initialKeywords =
    picture?.keywords?.map((keyword) => String(keyword?.keyword)) || [];

  useEffect(() => {
    dispatch(initializeKeywords());
  }, [dispatch, show]);

  const keywordsList = useAppSelector(
    (state) => state.keywords?.keywords ?? []
  );

  const keywords = useMemo(() => {
    return keywordsList.map((keyword) => String(keyword.keyword));
  }, [keywordsList]);

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

  useEffect(() => {
    if (picture && show) {
      setType(picture.type);
      setTextFi(
        picture.text && picture.text.textFi ? picture.text.textFi : undefined
      );
      setTextEn(
        picture.text && picture.text.textEn ? picture.text.textEn : undefined
      );
      const YearMonth = picture?.monthYear;
      setKeywordArray(
        Array.from(picture?.keywords.map((keyword) => String(keyword?.keyword)))
      );

      setYear(Number(YearMonth?.toString().slice(0, 4)) || undefined);
      setMonth(Number(YearMonth?.toString().slice(-2)) || undefined);
      dispatch(initializeComments(picture.id));
    }
  }, [picture, dispatch, show]);

  const comments = useAppSelector((state) => state.comments.comments);

  const deleteComment = (comment: Comment) => {
    const deleteComment: DeleteComment = {
      userId: "admin",
      comment: comment,
    };
    if (window.confirm(`Do you really want to delete this comment?`)) {
      dispatch(remove(deleteComment, navigate, "eng"));
    }
    return;
  };

  const reset = () => {
    setType(picture.type);
    setTextFi(picture.text?.textFi || "");
    setTextEn(picture.text?.textEn || "");
    const YearMonth = picture?.monthYear;
    setYear(Number(YearMonth?.toString().slice(0, 4)) || undefined);
    setMonth(Number(YearMonth?.toString().slice(-2)) || undefined);
    setKeywordArray(
      picture?.keywords?.map((keyword) => String(keyword?.keyword)) || []
    );
  };

  const clear = () => {
    setType(picture.type);
    setTextFi("");
    setTextEn("");
    setMonth(undefined);
    setYear(undefined);
    setKeywordArray([]);
  };

  const areKeywordsEqual = (keywords1: string[], keywords2: string[]) => {
    if (keywords1.length !== keywords2.length) return false;
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    return (
      keywords1.every((item) => set2.has(item)) &&
      keywords2.every((item) => set1.has(item))
    );
  };

  const handleEditPicture = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pictureId = picture.id;

    if (!pictureId) {
      console.error("No picture found!");
      return;
    }

    const form = event.currentTarget;
    const rawValue = (form.elements.namedItem("type") as HTMLInputElement)
      ?.value;

    const typeValue: Type = typeCheck(rawValue);

    const yearValue =
      typeValue != "monthly"
        ? null
        : parseInt(
            (form.elements.namedItem("year") as HTMLInputElement)?.value
          );
    const monthValue =
      typeValue != "monthly"
        ? null
        : parseInt(
            (form.elements.namedItem("month") as HTMLInputElement)?.value
          );
    const textFiValue =
      (form.elements.namedItem("textFi") as HTMLInputElement)?.value === ""
        ? undefined
        : (form.elements.namedItem("textFi") as HTMLInputElement)?.value;
    const textEnValue =
      (form.elements.namedItem("textEn") as HTMLInputElement)?.value === ""
        ? undefined
        : (form.elements.namedItem("textEn") as HTMLInputElement)?.value;

    const newKeywordsSet = areKeywordsEqual(keywordArray, initialKeywords)
      ? []
      : keywordArray;

    const formData = {
      type: typeValue,
      textFi: textFiValue,
      textEn: textEnValue,
      keywords: newKeywordsSet,
      month: monthValue,
      year: yearValue,
    };

    dispatch(editPicture({ pictureId, formData }, navigate));
    handleClose();
  };

  const handleClose = () => {
    clear();
    setShow(false);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(typeCheck(event.target.value));

    if (type !== "monthly") {
      if (year !== null || month !== null) {
        setYear(undefined);
        setMonth(undefined);
      }
    }
  };

  const handleTextFiChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextFi(event.target.value);
  };

  const handleTextEnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextEn(event.target.value);
  };

  const handleReplyComment = (comment: Comment | Reply) => {
    setCurrentComment(comment);
    setShowCommentForm(true);
    setReply(true);
  };

  if (!show) {
    return null;
  }

  return (
    <div
      id="closeModal"
      className="editOverlay"
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
    >
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
                src={picture.urlThumbnail}
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
                  <option value={undefined} disabled>
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
                      onChange={(e) => setMonth(Number(e.target.value))}
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
                  rows={4}
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
                  rows={4}
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
              onChange={(_event, newValue) => {
                setKeywordArray(newValue);
              }}
              renderValue={(value, getTagProps) =>
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
                      <div className="commentText">
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
                    adminComment={true}
                    edit={false}
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

export default EditPicture;
