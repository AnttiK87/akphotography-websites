import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useRedux.js";

import { initializeReplies, remove } from "../../reducers/replyReducer.js";

import { useLanguage } from "../../hooks/useLanguage.js";
import { getUserId } from "../../utils/createAndGetUserId.js";

import ReplyItem from "./ReplyItem.js";

import "./Comments.css";

import type { Reply, DeleteReply } from "../../types/replyTypes.js";

type RepliesProps = {
  pictureId: number;
  commentId: number;
  handleEditComment: (value: Reply) => void;
  handleReplyComment: (value: Reply) => void;
};

const Replies = ({
  pictureId,
  commentId,
  handleEditComment,
  handleReplyComment,
}: RepliesProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const userId = getUserId();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeReplies(pictureId));
  }, [dispatch, pictureId]);

  const replies = useAppSelector((state) => state.replies.replies);

  const deleteReply = ({ reply, userId }: DeleteReply) => {
    if (
      window.confirm(
        language === "fin"
          ? "Haluatko varmasti poistaa tämän vastauksen?"
          : `Do you really want to delete this reply?`
      )
    ) {
      dispatch(remove({ reply, userId }, navigate, language));
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
            key={reply.id}
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

export default Replies;
