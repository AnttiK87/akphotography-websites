import { createSlice } from "@reduxjs/toolkit";
import replyService from "../services/replies";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

const initialState = {
  replies: [],
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setReplies(state, action) {
      state.replies = action.payload;
    },
    appendReply(state, action) {
      state.replies.push(action.payload);
    },
    updateReply(state, action) {
      const updatedReply = action.payload;
      state.replies = state.replies.map((reply) =>
        reply.id === updatedReply.id ? updatedReply : reply
      );
    },
    updateReplyAfterCommentUpdate(state, action) {
      const updatedComment = action.payload;

      state.replies = state.replies.map((reply) => {
        if (reply.commentId === updatedComment.id) {
          return {
            ...reply,
            comment: {
              username: updatedComment.username,
              comment: updatedComment.comment,
            },
          };
        }
        return reply;
      });
    },
    updateChildReplyAfterReplyUpdate(state, action) {
      const updatedReply = action.payload;

      state.replies = state.replies.map((reply) => {
        if (reply.parentReplyId === updatedReply.id) {
          return {
            ...reply,
            parentReply: {
              username: updatedReply.username,
              reply: updatedReply.reply,
            },
          };
        }
        return reply;
      });
    },
    deleteReply(state, action) {
      state.replies = state.replies.filter(
        (reply) => reply.id !== action.payload.id
      );
    },
  },
});

export const {
  setReplies,
  appendReply,
  updateReply,
  updateReplyAfterCommentUpdate,
  updateChildReplyAfterReplyUpdate,
  deleteReply,
} = replySlice.actions;

export const initializeReplies = (pictureId) => {
  return async (dispatch) => {
    try {
      const replies = await replyService.getAll(pictureId);
      dispatch(setReplies(replies));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const createReply = (content, language) => {
  return async (dispatch) => {
    try {
      const newReply = await replyService.create(content);

      dispatch(appendReply(newReply.reply));

      dispatch(
        showMessage(
          {
            text: `${
              language === "fin" ? newReply.messageFi : newReply.messageEn
            }`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      if (error.response?.status === 400) {
        dispatch(
          showMessage(
            {
              text:
                language === "fin"
                  ? error.response?.data?.messages.fi
                  : error.response?.data?.messages.en,
              type: "error",
            },
            3
          )
        );
      } else {
        handleError(error, dispatch);
      }
    }
  };
};

export const editReply = (content, language) => {
  return async (dispatch) => {
    try {
      const updatedReply = await replyService.update(content);
      dispatch(updateReply(updatedReply.reply));
      dispatch(updateChildReplyAfterReplyUpdate(updatedReply.reply));

      dispatch(
        showMessage(
          {
            text:
              language === "fin"
                ? updatedReply.messageFi
                : updatedReply.messageEn,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      console.error("Error response:", error);
      if (error.response?.status === 400) {
        dispatch(
          showMessage(
            {
              text:
                language === "fin"
                  ? error.response?.data?.messages.fi
                  : error.response?.data?.messages.en,
              type: "error",
            },
            3
          )
        );
      } else {
        handleError(error, dispatch);
      }
    }
  };
};

export const remove = (content, navigate, language) => {
  return async (dispatch) => {
    try {
      const deletedReply = await replyService.remove(content);
      dispatch(deleteReply(content.reply));

      dispatch(
        showMessage(
          {
            text:
              language === "fin"
                ? deletedReply.messageFi
                : deletedReply.messageEn,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deleteReply(content));
      }
    }
  };
};

export default replySlice.reducer;
