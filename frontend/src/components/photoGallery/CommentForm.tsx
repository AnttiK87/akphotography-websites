import React from "react";

import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import { useAppDispatch } from "../../hooks/useRedux.js";
import { createComment, editComment } from "../../reducers/commentReducer.js";
import { createReply, editReply } from "../../reducers/replyReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLanguage } from "../../hooks/useLanguage.js";
import { getUserId } from "../../utils/createAndGetUserId.js";
import { handleOverlayClose } from "../../utils/closeOverlay.js";
import useLightBox from "../../hooks/useLightBox.js";

import "./RatingInfo.css";

type CommentFormProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  pictureId: number;
  edit?: boolean;
  setEdit?: (value: boolean) => void;
  reply: boolean;
  setReply: (value: boolean) => void;
  adminComment: boolean;
  profilePicture?: string;
};

const CommentForm = ({
  show,
  setShow,
  pictureId,
  edit,
  setEdit,
  reply,
  setReply,
  adminComment,
  profilePicture,
}: CommentFormProps) => {
  const { language } = useLanguage();
  const { currentComment } = useLightBox();

  const [comment, setComment] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();

  useEffect(() => {
    if (!show) return;

    if (edit && currentComment) {
      setComment(
        "reply" in currentComment
          ? currentComment.reply
          : currentComment.comment
      );
      setUsername(currentComment.username);
    } else if (adminComment) {
      setUsername("Antti Kortelainen");
      setComment(undefined);
    } else {
      setComment(undefined);
      setUsername(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const dispatch = useAppDispatch();

  const reset = () => {
    setComment(undefined);
    setUsername(undefined);
  };

  const addComment = (event: React.FormEvent<HTMLFormElement>) => {
    const userId = getUserId();

    event.preventDefault();

    const comment = (
      event.currentTarget.elements.namedItem("comment") as HTMLInputElement
    ).value;
    const username = (
      event.currentTarget.elements.namedItem("username") as HTMLInputElement
    ).value;

    const formData = {
      comment: comment,
      username: username,
      pictureId: pictureId,
      userId: userId,
    };

    dispatch(createComment(formData, language));

    setShow(false);
  };

  const addReply = (event: React.FormEvent<HTMLFormElement>) => {
    const userId = getUserId();
    event.preventDefault();

    if (!currentComment) {
      throw new Error("Comment missing");
    }

    const reply = (
      event.currentTarget.elements.namedItem("comment") as HTMLInputElement
    ).value;
    const username = (
      event.currentTarget.elements.namedItem("username") as HTMLInputElement
    ).value;

    const commentId =
      "reply" in currentComment ? currentComment.commentId : currentComment.id;

    const parentReply = "reply" in currentComment ? currentComment.id : null;

    const formData = {
      reply: reply,
      username: username,
      commentId: commentId,
      userId: userId,
      pictureId: currentComment.pictureId,
      parentReplyId: parentReply,
      adminReply: adminComment ? true : false,
      profilePicture: profilePicture ? profilePicture : undefined,
    };

    dispatch(createReply(formData, language));

    setShow(false);
  };

  const handleEditComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userId = getUserId();
    const commentId = currentComment?.id;

    if (!commentId) {
      console.error("No comment ID found!");
      return;
    }

    const comment = (
      event.currentTarget.elements.namedItem("comment") as HTMLInputElement
    ).value;
    const username = (
      event.currentTarget.elements.namedItem("username") as HTMLInputElement
    ).value;

    if (!comment || !username) {
      console.error("Comment or username is missing!");
      return;
    }

    const key = "reply" in currentComment ? "reply" : "comment";
    if (key === "comment") {
      const formData: { comment: string; username: string } = {
        comment,
        username,
      };
      dispatch(editComment({ commentId, userId, formData }, language));
    } else {
      const formData: { reply: string; username: string } = {
        reply: comment,
        username,
      };
      dispatch(editReply({ commentId, userId, formData }, language));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    if (edit && setEdit) {
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
  } else if (reply && currentComment) {
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

  return (
    <div
      id="closeModal"
      className="OverlayRI comment"
      onMouseDown={(event) => handleOverlayClose(event, handleClose)}
    >
      <div className="ratingInfo comment">
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
                value={username === undefined ? "" : username}
                onChange={(event) => setUsername(event.target.value)}
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
                value={comment === undefined ? "" : comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={
                  reply
                    ? altCommentPlaceHold
                    : language === "fin"
                    ? "Anna lisättävä kommentti..."
                    : "Add comment here..."
                }
                required
                rows={2}
              />
            </div>
          </div>

          <div className="commentButtons">
            <button
              className="button-primary  delButton"
              type="button"
              onClick={reset}
            >
              {language === "fin" ? "Tyhjennä" : "Clear All"}
            </button>
            <button className="button-primary" type="submit">
              {buttonText}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CommentForm;
