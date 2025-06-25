import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCircleUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";

import { initializeComments, remove } from "../../reducers/commentReducer.js";

import { useLanguage } from "../../hooks/useLanguage.js";

import { getUserId } from "../../utils/createAndGetUserId.js";
import { timeSince } from "../../utils/timeSince.js";

import Replies from "./Replies.jsx";

import "./Comments.css";

const Comments = ({
  pictureId,
  setShow,
  setEdit,
  setReply,
  setCurrentComment,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const userId = getUserId();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeComments(pictureId));
  }, [dispatch, pictureId]);

  const comments = useSelector((state) => state.comments.comments);

  const deleteComment = async ({ comment, userId }) => {
    if (
      window.confirm(
        language === "fin"
          ? "Haluatko varmasti poistaa tämän kommentin?"
          : "Do you really want to delete this comment?"
      )
    ) {
      await dispatch(remove({ comment, userId }, navigate, language));
    }
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
                                onClick={() =>
                                  deleteComment({ comment, userId })
                                }
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
  setShow: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setReply: PropTypes.func.isRequired,
  setCurrentComment: PropTypes.func.isRequired,
};

export default Comments;
