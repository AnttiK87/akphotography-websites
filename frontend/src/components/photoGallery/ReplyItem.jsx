import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCircleUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import { timeSince } from "../../utils/timeSince";

import arrow from "../../assets/response-arrow.png";

import "./Comments.css";

const ReplyItem = ({
  reply,
  replies,
  userId,
  handleEditComment,
  deleteReply,
  handleReplyComment,
  language,
  child,
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
    <>
      <div className={`arrowAndReply ${child ? "makeNarrow" : ""}`}>
        <img className="replyArrow" src={arrow} alt="arrow" />
        <div className="replyLi">
          <div className="containerUsername">
            <div className="IconAndTexts">
              {reply.adminReply === true ? (
                <img
                  className="adminUserImg"
                  src="/images/about/me2.jpg"
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
                  {timeSince(reply.updatedAt, reply.createdAt, language)}
                </div>
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

ReplyItem.propTypes = {
  reply: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    comment: PropTypes.shape({
      username: PropTypes.string,
      comment: PropTypes.string,
    }),
    reply: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    parentReplyId: PropTypes.number,
    parentReply: PropTypes.shape({
      username: PropTypes.string,
      reply: PropTypes.string,
    }),
    adminReply: PropTypes.bool.isRequired,
  }).isRequired,
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      parentReplyId: PropTypes.number,
    })
  ).isRequired,
  userId: PropTypes.string.isRequired,
  handleEditComment: PropTypes.func.isRequired,
  deleteReply: PropTypes.func.isRequired,
  handleReplyComment: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  child: PropTypes.bool,
};

export default ReplyItem;
