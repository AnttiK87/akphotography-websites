//component for rendering form for adding blogs

//dependencies
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { editKeyword } from "../../reducers/keywordReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./EditPicture.css";
import "./OwnProfile.css";

const EditPicture = ({ show, setShow, keyword }) => {
  const dispatch = useDispatch();

  console.log("this is keyword edited", JSON.stringify(keyword?.keyword));

  const [keywordText, setKeywordText] = useState("");

  useEffect(() => {
    if (keyword?.keyword) {
      setKeywordText(keyword.keyword);
    }
  }, [keyword]);

  const clear = () => {
    setKeywordText("");
  };

  const handleEditKeyword = (event) => {
    event.preventDefault();
    const keywordId = keyword.id;

    //console.log(`id: ${pictureId}`);

    if (!keywordId) {
      console.error("No keykword found!");
      return;
    }

    const keywordValue = event.target.elements?.keywordEdit?.value;

    //console.log(`newkeywords: ${newKeywordsSet}`);

    const formData = {
      keyword: keywordValue,
    };

    //console.log(`formdata: ${JSON.stringify(formData)}`);
    dispatch(editKeyword({ keywordId, formData }));
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

  if (!show) {
    return null;
  }

  return (
    <div id="closeModal" className="editOverlay" onClick={handleOverlayClose}>
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

EditPicture.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  keyword: PropTypes.object,
};

export default EditPicture;
