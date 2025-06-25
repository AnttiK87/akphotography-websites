import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comments";
import { showMessage } from "./messageReducer";
import { updateReplyAfterCommentUpdate } from "./replyReducer";
import { handleError } from "../utils/handleError";

const initialState = {
  comments: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments(state, action) {
      state.comments = action.payload;
    },
    appendComment(state, action) {
      state.comments.push(action.payload);
    },
    updateComment(state, action) {
      const updatedComment = action.payload;

      state.comments = state.comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      );
    },
    deleteComment(state, action) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload.id
      );
    },
  },
});

export const { setComments, appendComment, updateComment, deleteComment } =
  commentSlice.actions;

export const initializeComments = (id) => {
  return async (dispatch) => {
    try {
      const comments = await commentService.getAll(id);
      dispatch(setComments(comments));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const createComment = (content, language) => {
  return async (dispatch) => {
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
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const editComment = (content, language) => {
  return async (dispatch) => {
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

export const remove = (content, navigate, language) => {
  return async (dispatch) => {
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
    } catch (error) {
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deleteComment(content.comment));
      }
    }
  };
};

export default commentSlice.reducer;
