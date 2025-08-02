import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

import { initializeReplies, remove } from "../../reducers/replyReducer.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import type { Comment } from "../../types/commentTypes.js";
import type { Reply, DeleteReply } from "../../types/replyTypes.js";

type AdminRepliesProps = {
  pictureId: number;
  commentId: number;
  handleReplyComment: (comment: Comment | Reply) => void;
};

type AdminReplyItemProps = {
  index?: number;
  reply: Reply;
  replies: Reply[];
  deleteReply: (content: DeleteReply) => void;
  handleReplyComment: (comment: Comment | Reply) => void;
};

const AdminReplies = ({
  pictureId,
  commentId,
  handleReplyComment,
}: AdminRepliesProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeReplies(pictureId));
  }, [dispatch, pictureId]);

  const replies = useAppSelector((state) => state.replies.replies);

  const deleteReply = ({ reply, userId }: DeleteReply) => {
    if (window.confirm(`Do you really want to delete this reply?`)) {
      dispatch(remove({ reply, userId }, navigate, "eng"));
    }
  };

  return (
    <div className="replies">
      {replies
        .filter(
          (reply) =>
            reply.commentId === commentId && reply.parentReplyId === null
        )
        .map((reply, index) => (
          <AdminReplyItem
            index={index}
            key={`replyId-${reply.id}`}
            reply={reply}
            replies={replies}
            deleteReply={deleteReply}
            handleReplyComment={handleReplyComment}
          />
        ))}
    </div>
  );
};

const AdminReplyItem = ({
  reply,
  replies,
  deleteReply,
  handleReplyComment,
}: AdminReplyItemProps) => {
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
    <div key={reply.id} className="RepliesEP">
      <div className="EditPictureComment replyEP">
        <div>
          <div>
            <div className="commentText">
              Reply to users: <b>{UsernameReplied}</b> comment:{" "}
              <b>{replyReplied}</b>
            </div>
            <div className="commentText">
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

export default AdminReplies;
