import { useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { initializeReplies, remove } from "../../reducers/replyReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const AdminReplies = ({ pictureId, commentId, handleReplyComment }) => {
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
    <div className="replies">
      {replies
        .filter(
          (reply) =>
            reply.commentId === commentId && reply.parentReplyId === null
        )
        .map((reply, index) => (
          <>
            <AdminReplyItem
              index={index}
              key={`replyId-${reply.id}`}
              reply={reply}
              replies={replies}
              deleteReply={deleteReply}
              handleReplyComment={handleReplyComment}
            />
          </>
        ))}
    </div>
  );
};

const AdminReplyItem = ({
  reply,
  replies,
  deleteReply,
  handleReplyComment,
}) => {
  const childReplies = replies.filter((r) => r.parentReplyId === reply.id);

  const UsernameReplied =
    reply.parentReply != undefined
      ? reply.parentReply.username
      : reply.comment.username;

  const replyReplied =
    reply.parentReply != undefined
      ? reply.parentReply.reply
      : reply.comment.comment;

  return (
    <div className="RepliesEP">
      <div className="EditPictureComment replyEP">
        <div>
          <div>
            <div>
              Reply to users: <b>{UsernameReplied}</b> comment:{" "}
              <b>{replyReplied}</b>
            </div>
            <div>
              by user: <b>{reply.adminReply ? "ADMIN USER" : reply.username}</b>{" "}
              with comment: <b>{reply.reply}</b>
            </div>
          </div>

          <div>
            Reply added: <b>{new Date(reply.createdAt).toLocaleString()}</b>
            {reply.updatedAt > reply.createdAt ? (
              <>
                {" "}
                and edited: <b>{new Date(reply.createdAt).toLocaleString()}</b>
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
            onClick={() => deleteReply({ reply, userId: "admin" })}
          />
          <div onClick={() => handleReplyComment(reply)} className="answerText">
            Reply
          </div>
        </div>
      </div>

      {childReplies.length > 0 && (
        <div className="childReplies">
          {childReplies.map((childReply) => (
            <AdminReplyItem
              key={childReply.id}
              reply={childReply}
              replies={replies}
              deleteReply={deleteReply}
              handleReplyComment={handleReplyComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

AdminReplies.propTypes = {
  pictureId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  handleEditComment: PropTypes.func.isRequired,
  handleReplyComment: PropTypes.func.isRequired,
};

AdminReplyItem.propTypes = {
  reply: PropTypes.object.isRequired,
  replies: PropTypes.object.isRequired,
  deleteReply: PropTypes.func.isRequired,
  handleReplyComment: PropTypes.func.isRequired,
};

export default AdminReplies;
