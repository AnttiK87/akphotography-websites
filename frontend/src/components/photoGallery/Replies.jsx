import { useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { initializeReplies, remove } from "../../reducers/replyReducer.js";

import { useLanguage } from "../../hooks/useLanguage.js";
import { getUserId } from "../../utils/createAndGetUserId.js";

import ReplyItem from "./ReplyItem.jsx";

import "./Comments.css";

const Replies = ({
  pictureId,
  commentId,
  handleEditComment,
  handleReplyComment,
}) => {
  const { language } = useLanguage();

  const userId = getUserId();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeReplies(pictureId));
  }, [dispatch, pictureId]);

  const replies = useSelector((state) => state.replies.replies);

  const deleteReply = ({ reply, userId }) => {
    if (window.confirm(`Do you really want to delete this reply?`)) {
      dispatch(remove({ reply, userId }));
    }
    return;
  };

  return (
    <div className="reply">
      {replies
        .filter(
          (reply) =>
            reply.commentId === commentId && reply.parentReplyId === null
        )
        .map((reply) => (
          <ReplyItem
            key={`replyId-${reply.id}`}
            reply={reply}
            replies={replies}
            userId={userId}
            handleEditComment={handleEditComment}
            deleteReply={deleteReply}
            handleReplyComment={handleReplyComment}
            language={language}
          />
        ))}
    </div>
  );
};

Replies.propTypes = {
  pictureId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  handleEditComment: PropTypes.func.isRequired,
  handleReplyComment: PropTypes.func.isRequired,
};

export default Replies;
