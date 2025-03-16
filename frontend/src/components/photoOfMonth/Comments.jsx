import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCircleUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";

import { initializeComments, remove } from "../../reducers/commentReducer.js";

import { useLanguage } from "../../hooks/useLanguage";

import { getUserId } from "../../utils/createAndGetUserId";
import { timeSince } from "../../utils/timeSince";

import CommentForm from "./CommentForm";
import Replies from "./Replies.jsx";

import "./Comments.css";

const Comments = ({ pictureId }) => {
  const { language } = useLanguage();

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reply, setReply] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  const userId = getUserId();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeComments(pictureId));
  }, [dispatch, pictureId]);

  const comments = useSelector((state) => state.comments.comments);

  const deleteComment = ({ comment, userId }) => {
    if (window.confirm(`Do you really want to delete this comment?`)) {
      dispatch(remove({ comment, userId }));
    }
    return;
  };

  const handleEditComment = (comment) => {
    setCurrentComment(comment);
    setShow(true);
    setEdit(true);
  };

  const handleReplyComment = (comment) => {
    setCurrentComment(comment);
    setShow(true);
    setReply(true);
  };

  return (
    <>
      <CommentForm
        show={show}
        setShow={setShow}
        pictureId={pictureId}
        edit={edit}
        setEdit={setEdit}
        reply={reply}
        setReply={setReply}
        currentComment={currentComment}
      />
      <div className="comments">
        <div className="CommentHeaderAndButton">
          <h3 className="commentsHeader">
            {language === "fin" ? "Kommentit" : "Comments"}
          </h3>{" "}
          <button className="button-primary" onClick={() => setShow(true)}>
            {language === "fin" ? "Lisää kommentti" : "Add Comment"}
          </button>
        </div>
        <div className="listContainer">
          {comments.length === 0 ? (
            <div className="noComments">
              {language === "fin"
                ? "Ei lisättyjä kommentteja."
                : "No added comments."}
            </div>
          ) : (
            comments.map((comment) => (
              <div
                className="CommentAndReplyContainer"
                key={`commentId-${comment.id}`}
              >
                <div className="commentLiContainer">
                  <div className="commentLi">
                    <div className="containerUsername">
                      <div className="IconAndTexts">
                        <FontAwesomeIcon
                          className="iconUser"
                          icon={faCircleUser}
                        />
                        <div className="CommentTexts">
                          <h5 className="h5Username">{comment.username}</h5>
                          <div className="commentText">{comment.comment}</div>
                          <div className="commentTime">
                            {timeSince(
                              comment.updatedAt,
                              comment.createdAt,
                              language
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="editIconsAndAnswer">
                        {comment.userId === userId && (
                          <div className="EditsIcons">
                            <FontAwesomeIcon
                              className="EditIcon"
                              icon={faPen}
                              onClick={() => handleEditComment(comment)}
                            />
                            <FontAwesomeIcon
                              className="EditIcon"
                              icon={faTrash}
                              onClick={() => deleteComment({ comment, userId })}
                            />
                          </div>
                        )}
                        <div
                          onClick={() => handleReplyComment(comment)}
                          className="answerText"
                        >
                          {language === "fin" ? "Vastaa" : "Reply"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Replies
                  key={`commentRepliesId-${comment.id}`}
                  pictureId={pictureId}
                  commentId={comment.id}
                  handleEditComment={handleEditComment}
                  handleReplyComment={handleReplyComment}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

Comments.propTypes = {
  pictureId: PropTypes.number.isRequired,
};

export default Comments;
