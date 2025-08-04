import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comments";
import { showMessage } from "./messageReducer";
import { updateReplyAfterCommentUpdate } from "./replyReducer";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../types/types";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosError } from "axios";
import type {
  Comment,
  CreateComment,
  UpdateComment,
  DeleteComment,
} from "../types/commentTypes";

interface CommentState {
  comments: Comment[];
}

const initialState: CommentState = {
  comments: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload;
    },
    appendComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const updatedComment = action.payload;
      state.comments = state.comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      );
    },
    deleteComment(state, action: PayloadAction<Comment>) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload.id
      );
    },
  },
});

export const { setComments, appendComment, updateComment, deleteComment } =
  commentSlice.actions;

export const initializeComments = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const comments = await commentService.getAll(id);
      dispatch(setComments(comments));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const createComment = (content: CreateComment, language: Language) => {
  return async (dispatch: AppDispatch) => {
    try {
      const newComment = await commentService.create(content);
      dispatch(appendComment(newComment.comment));

      dispatch(
        showMessage(
          {
            text: `${
              language === "fin" ? newComment.messageFi : newComment.messageEn
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

export const editComment = (content: UpdateComment, language: Language) => {
  return async (dispatch: AppDispatch) => {
    try {
      const updatedComment = await commentService.update(content);
      dispatch(updateComment(updatedComment.comment));
      dispatch(updateReplyAfterCommentUpdate(updatedComment.comment));

      dispatch(
        showMessage(
          {
            text:
              language === "fin"
                ? updatedComment.messageFi
                : updatedComment.messageEn,
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
  content: DeleteComment,
  navigate: NavigateFunction,
  language: Language
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const deletedComment = await commentService.remove(content);
      dispatch(deleteComment(content.comment));

      dispatch(
        showMessage(
          {
            text:
              language === "fin"
                ? deletedComment.messageFi
                : deletedComment.messageEn,
            type: "success",
          },
          1
        )
      );
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deleteComment(content.comment));
      }
    }
  };
};

export default commentSlice.reducer;
