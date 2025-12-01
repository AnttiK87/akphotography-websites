import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCircleUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import { timeSince } from "../../utils/timeSince";

import arrow from "../../assets/response-arrow.png";

import "./Comments.css";

import type { Reply, DeleteReply } from "../../types/replyTypes.js";
import type { Language } from "../../types/types.js";

type ReplyItemProps = {
  reply: Reply;
  replies: Reply[];
  userId: string;
  pictureId?: number;
  commentId?: number;
  handleEditComment: (value: Reply) => void;
  handleReplyComment: (value: Reply) => void;
  deleteReply: (value: DeleteReply) => void;
  language: Language;
  child?: boolean;
};

const ReplyItem = ({
  reply,
  replies,
  userId,
  handleEditComment,
  deleteReply,
  handleReplyComment,
  language,
  child,
}: ReplyItemProps) => {
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
    <>
      <div className={`arrowAndReply ${child ? "makeNarrow" : ""}`}>
        <img className="replyArrow" src={arrow} alt="arrow" />
        <div className="replyLi">
          <div className="containerUsername">
            <div className="IconAndTexts">
              {reply.adminReply === true ? (
                <img
                  className="adminUserImg"
                  src={
                    reply.profilePicture === undefined ||
                    reply.profilePicture === null ||
                    reply.profilePicture === "0"
                      ? "/images/about/profile-picture.jpg"
                      : reply.profilePicture
                  }
                  alt="adminPhoto"
                />
              ) : (
                <FontAwesomeIcon className="iconUser" icon={faCircleUser} />
              )}
              <div className="CommentTexts">
                <div className="userAndOrigComment">
                  <h5 className="h5Username">{reply.username}</h5>
                  {reply.comment && (
                    <div className="commentTextForReply">
                      <b>@{UsernameReplied}</b> {replyReplied}
                    </div>
                  )}
                </div>
                <div className="commentText">{reply.reply}</div>
                <div className="commentTime">
                  {timeSince(
                    new Date(reply.updatedAt),
                    new Date(reply.createdAt),
                    language
                  )}
                </div>
              </div>

              <div className="editIconsAndAnswer">
                {reply.userId === userId && (
                  <div className="EditsIcons">
                    <FontAwesomeIcon
                      className="EditIcon"
                      icon={faPen}
                      onClick={() => handleEditComment(reply)}
                    />
                    <FontAwesomeIcon
                      className="EditIcon"
                      icon={faTrash}
                      onClick={() => deleteReply({ reply, userId })}
                    />
                  </div>
                )}
                <div
                  onClick={() => handleReplyComment(reply)}
                  className="answerText"
                >
                  {language === "fin" ? "Vastaa" : "Reply"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {childReplies.length > 0 && (
        <div className="childReplies">
          {childReplies.map((childReply) => (
            <ReplyItem
              key={childReply.id}
              reply={childReply}
              replies={replies}
              userId={userId}
              handleEditComment={handleEditComment}
              deleteReply={deleteReply}
              handleReplyComment={handleReplyComment}
              language={language}
              child={true}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ReplyItem;
