import React from "react";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../hooks/useRedux.js";
import { editKeyword } from "../../reducers/keywordReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { handleOverlayClose } from "../../utils/closeOverlay.js";

import "./EditPicture.css";
import "./OwnProfile.css";

import type { Keyword } from "../../types/keywordTypes.js";

type EditKeywordsProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  keyword: Keyword;
};

const EditKeywords = ({ show, setShow, keyword }: EditKeywordsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [keywordText, setKeywordText] = useState("");

  useEffect(() => {
    if (keyword && keyword.keyword) {
      setKeywordText(keyword.keyword);
    }
  }, [keyword]);

  const clear = () => {
    setKeywordText("");
  };

  const handleEditKeyword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keywordId = keyword.id;

    if (!keywordId) {
      console.error("No keykword found!");
      return;
    }

    const form = event.currentTarget;
    const keywordValue = (
      form.elements.namedItem("keywordEdit") as HTMLInputElement
    )?.value;

    const formData = {
      keyword: keywordValue,
    };

    dispatch(editKeyword({ keywordId, formData }, "eng", navigate));
    handleClose();
  };

  const handleClose = () => {
    clear();
    setShow(false);
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
          <div className="mainHeaderEKW">
            <h3>Edit keyword:</h3>
            <div onClick={() => handleClose()}>
              <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
            </div>
          </div>
          <Form
            onSubmit={handleEditKeyword}
            encType="multipart/form-data"
            className="formContainerEP"
          >
            <div className="form__group input">
              <label htmlFor="keywordEdit" className="form__label">
                Keyword
              </label>
              <input
                type="text"
                className="form__field inputKeyword"
                id="keywordEdit"
                name="keywordEdit"
                value={keywordText}
                onChange={(e) => {
                  setKeywordText(e.target.value);
                }}
                required
              />
            </div>

            <div className="commentButtons">
              <button className="button-primary" type="submit">
                Save
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditKeywords;
