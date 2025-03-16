//component for rendering form for adding blogs

//dependencies
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { createComment, editComment } from "../../reducers/commentReducer.js";
import { createReply, editReply } from "../../reducers/replyReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLanguage } from "../../hooks/useLanguage";
import { getUserId } from "../../utils/createAndGetUserId";

import "./RatingInfo.css";

const CommentForm = ({
  show,
  setShow,
  pictureId,
  edit,
  setEdit,
  reply,
  setReply,
  currentComment,
}) => {
  // console.log(`commentform reply: ${JSON.stringify(currentComment)}`);
  // console.log(`currentComment.comment: ${currentComment.comment}`);
  const { language } = useLanguage();

  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (edit) {
      if (currentComment.reply != undefined) {
        setComment(currentComment.reply);
      } else {
        setComment(currentComment.comment);
      }
      setUsername(currentComment.username);
    }
  }, [show, edit, currentComment]);

  const reset = () => {
    setComment("");
    setUsername("");
  };

  const addComment = (event) => {
    const userId = getUserId();

    event.preventDefault();

    const { comment, username } = event.target.elements;

    const formData = {
      comment: comment.value,
      username: username.value,
      pictureId: pictureId,
      userId: userId,
    };

    dispatch(createComment(formData));

    reset();
    setShow(false);
  };

  const addReply = (event) => {
    const userId = getUserId();

    event.preventDefault();

    const { comment, username } = event.target.elements;

    //console.log(`add reply currentComment: ${JSON.stringify(currentComment)}`);

    const commentId =
      currentComment.reply !== undefined
        ? currentComment.commentId
        : currentComment.id;

    const parentReply =
      currentComment.reply !== undefined ? currentComment.id : null;

    //console.log(`add reply comment id: ${commentId}`);

    const formData = {
      reply: comment.value,
      username: username.value,
      commentId: commentId,
      userId: userId,
      pictureId: currentComment.pictureId,
      parentReplyId: parentReply,
    };

    dispatch(createReply(formData));

    reset();
    setShow(false);
  };

  const handleEditComment = (event) => {
    //console.log("tries to edit");
    event.preventDefault();

    const userId = getUserId();
    const commentId = currentComment?.id;

    if (!commentId) {
      console.error("No comment ID found!");
      return;
    }

    const commentValue = event.target.elements?.comment?.value;
    const usernameValue = event.target.elements?.username?.value;

    if (!commentValue || !usernameValue) {
      console.error("Comment or username is missing!");
      return;
    }

    const key = currentComment.reply !== undefined ? "reply" : "comment";
    const formData = { [key]: commentValue, username: usernameValue };

    console.log(`formdata ${JSON.stringify(formData)}`);

    if (key === "comment") {
      dispatch(editComment({ commentId, userId, formData }));
    } else {
      dispatch(editReply({ commentId, userId, formData }));
    }

    reset();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //console.log(`handlesubmit and edit state: ${edit}`);

    if (edit) {
      handleEditComment(event);
      handleClose();
    } else if (reply) {
      addReply(event);
      handleClose();
    } else {
      addComment(event);
      handleClose();
    }
  };

  const handleClose = () => {
    if (edit) {
      setEdit(false);
    } else if (reply) {
      setReply(false);
    }
    reset();
    setShow(false);
  };

  let headerText = language === "fin" ? "Lisää kommentti" : "Add Comment";
  if (edit) {
    headerText = language === "fin" ? "Muokkaa kommenttia" : "Edit Comment";
  } else if (reply) {
    headerText =
      language === "fin"
        ? `Vastaa käyttäjän ${currentComment.username} kommenttiin`
        : `Reply to the user's ${currentComment.username} comment`;
  }

  let buttonText = language === "fin" ? "Kommentoi" : "Add Comment";
  if (edit) {
    buttonText = language === "fin" ? "Muokkaa" : "Edit";
  } else if (reply) {
    buttonText = language === "fin" ? "Vastaa" : "Reply";
  }

  const altCommentLabel = language === "fin" ? "Vastaus" : "Reply";
  const altCommentPlaceHold =
    language === "fin" ? "Anna vastaus tähän..." : "Add your reply here...";

  if (!show) {
    return null;
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="ratingInfo">
      <div className="ratingInfoHeader">
        <h3>{headerText}</h3>
        <div onClick={() => handleClose()}>
          <FontAwesomeIcon className="CloseRatingInfo" icon={faXmark} />
        </div>
      </div>
      <Form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="formContainer"
      >
        <div className="form__group input">
          <div className="form__group input">
            <label htmlFor="username" className="form__label">
              {language === "fin" ? "Nimimerkki" : "Username"}
            </label>
            <input
              type="text"
              className="form__field commentUsername"
              id="username"
              name="username"
              value={username} // Käytetään tilamuuttujaa
              onChange={handleUsernameChange} // Käyttäjä voi muokata arvoa
              placeholder={
                language === "fin" ? "Anna nimimerkki" : "Add username"
              }
              required
            />
          </div>

          <div className="form__group input">
            <label htmlFor="comment" className="form__label">
              {reply
                ? altCommentLabel
                : language === "fin"
                ? "Kommentti"
                : "Comment"}
            </label>
            <textarea
              className="form__field commentTextArea"
              id="comment"
              name="comment"
              value={comment}
              onChange={handleCommentChange}
              placeholder={
                reply
                  ? altCommentPlaceHold
                  : language === "fin"
                  ? "Anna lisättävä kommentti..."
                  : "Add comment here..."
              }
              required
              rows="2"
            />
          </div>
        </div>

        <div className="commentButtons">
          <button className="button-primary" type="submit">
            {buttonText}
          </button>
          <button className="button-primary  delButton" onClick={reset}>
            {language === "fin" ? "Tyhjennä" : "Clear All"}
          </button>
        </div>
      </Form>
    </div>
  );
};

CommentForm.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  pictureId: PropTypes.number.isRequired,
  edit: PropTypes.bool.isRequired,
  setEdit: PropTypes.func.isRequired,
  reply: PropTypes.bool.isRequired,
  setReply: PropTypes.func.isRequired,
  currentComment: PropTypes.object,
};

export default CommentForm;
