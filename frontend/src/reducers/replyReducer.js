//reducer for comments of the blogs
//depebdencies
import { createSlice } from "@reduxjs/toolkit";
import replyService from "../services/replies";
import { showMessage } from "./messageReducer";

const initialState = {
  replies: [],
};

//create slice
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
    deleteReply(state, action) {
      state.replies = state.replies.filter(
        (reply) => reply.id !== action.payload.id
      );
    },
  },
});

export const { setReplies, appendReply, updateReply, deleteReply } =
  replySlice.actions;

// Setting data to current state with error handling
export const initializeReplies = (pictureId) => {
  return async (dispatch) => {
    try {
      const replies = await replyService.getAll(pictureId);
      dispatch(setReplies(replies));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load replies: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

// Creating new comment and setting it to the state with error handling
export const createReply = (content) => {
  return async (dispatch) => {
    try {
      const newReply = await replyService.create(content);

      if (newReply.message === "Reply saved" && newReply.reply.id) {
        dispatch(appendReply(newReply.reply));
      }

      // show message comment added
      dispatch(
        showMessage(
          {
            text: `${newReply.message}`,
            type: "success",
          },
          5
        )
      );
    } catch (error) {
      // handle error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to add reply: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export const editReply = (content) => {
  return async (dispatch) => {
    try {
      console.log("this update indeed happens");
      const updatedReply = await replyService.update(content);
      dispatch(updateReply(updatedReply));

      dispatch(
        showMessage(
          {
            text: `Reply edited!`,
            type: "success",
          },
          10
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to edit Reply: ${error.message}`,
            type: "error",
          },
          10
        )
      );
    }
  };
};

export const remove = (content) => {
  return async (dispatch) => {
    try {
      await replyService.remove(content);
      dispatch(deleteReply(content.reply));

      dispatch(
        showMessage(
          {
            text: `Reply deleted successfully!`,
            type: "success",
          },
          10
        )
      );
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 404
          ? `Failed to delete the reply: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(showMessage({ text: errorMessage, type: "error" }, 10));

      if (error.response && error.response.status === 404) {
        dispatch(deleteReply(content));
      }
    }
  };
};

//export
export default replySlice.reducer;
