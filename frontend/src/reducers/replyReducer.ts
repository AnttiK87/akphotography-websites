import { createSlice } from "@reduxjs/toolkit";
import replyService from "../services/replies";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../types/types";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosError } from "axios";
import type { Comment } from "../types/commentTypes";
import type {
  Reply,
  AddReply,
  UpdateReply,
  DeleteReply,
} from "../types/replyTypes";

interface ReplyState {
  replies: Reply[];
}

const initialState: ReplyState = {
  replies: [],
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setReplies(state, action: PayloadAction<Reply[]>) {
      state.replies = action.payload;
    },
    appendReply(state, action: PayloadAction<Reply>) {
      state.replies.push(action.payload);
    },
    updateReply(state, action: PayloadAction<Reply>) {
      const updatedReply = action.payload;
      state.replies = state.replies.map((reply) =>
        reply.id === updatedReply.id ? updatedReply : reply
      );
    },
    updateReplyAfterCommentUpdate(state, action: PayloadAction<Comment>) {
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
    updateChildReplyAfterReplyUpdate(state, action: PayloadAction<Reply>) {
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
    deleteReply(state, action: PayloadAction<Reply>) {
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

export const initializeReplies = (pictureId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const replies = await replyService.getAll(pictureId);
      dispatch(setReplies(replies));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const createReply = (content: AddReply, language: Language) => {
  return async (dispatch: AppDispatch) => {
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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const editReply = (content: UpdateReply, language: Language) => {
  return async (dispatch: AppDispatch) => {
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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const remove = (
  content: DeleteReply,
  navigate: NavigateFunction,
  language: Language
) => {
  return async (dispatch: AppDispatch) => {
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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deleteReply(content.reply));
      }
    }
  };
};

export default replySlice.reducer;
