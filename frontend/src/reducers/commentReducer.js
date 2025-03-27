//reducer for comments of the blogs
//depebdencies
import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comments";
import { showMessage } from "./messageReducer";

const initialState = {
  comments: [],
};

//create slice
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

// Setting comments at db to current state with error handling
export const initializeComments = (id) => {
  return async (dispatch) => {
    try {
      const comments = await commentService.getAll(id);
      dispatch(setComments(comments));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load comments: ${error.message}`,
            type: "error",
          },
          2
        )
      );
    }
  };
};

// Creating new comment and setting it to the state with error handling
export const createComment = (content) => {
  return async (dispatch) => {
    try {
      const newComment = await commentService.create(content);

      if (newComment.message === "Comment saved" && newComment.comment.id) {
        dispatch(appendComment(newComment.comment));
      }

      // show message comment added
      dispatch(
        showMessage(
          {
            text: `${newComment.message}`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      // handle error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to add comment: ${error.message}`,
            type: "error",
          },
          2
        )
      );
    }
  };
};

export const editComment = (content) => {
  return async (dispatch) => {
    try {
      console.log("this update indeed happens");
      const updatedComment = await commentService.update(content);
      dispatch(updateComment(updatedComment));

      dispatch(
        showMessage(
          {
            text: `Comment edited!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to edit comment: ${error.message}`,
            type: "error",
          },
          2
        )
      );
    }
  };
};

export const remove = (content) => {
  return async (dispatch) => {
    try {
      await commentService.remove(content);
      dispatch(deleteComment(content.comment));

      dispatch(
        showMessage(
          {
            text: `Comment deleted successfully!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 404
          ? `Failed to delete the comment: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(showMessage({ text: errorMessage, type: "error" }, 2));

      if (error.response && error.response.status === 404) {
        dispatch(deleteComment(content));
      }
    }
  };
};

//export
export default commentSlice.reducer;
