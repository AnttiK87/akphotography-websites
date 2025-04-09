import { createSlice } from "@reduxjs/toolkit";
import replyService from "../services/replies";
import { showMessage } from "./messageReducer";

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
    deleteReply(state, action) {
      state.replies = state.replies.filter(
        (reply) => reply.id !== action.payload.id
      );
    },
  },
});

export const { setReplies, appendReply, updateReply, deleteReply } =
  replySlice.actions;

export const initializeReplies = (pictureId) => {
  return async (dispatch) => {
    try {
      const replies = await replyService.getAll(pictureId);
      dispatch(setReplies(replies));
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to load replies: ${error.message}`,
            type: "error",
          },
          2
        )
      );
    }
  };
};

export const createReply = (content) => {
  return async (dispatch) => {
    try {
      const newReply = await replyService.create(content);

      if (newReply.message === "Reply saved" && newReply.reply.id) {
        dispatch(appendReply(newReply.reply));
      }

      dispatch(
        showMessage(
          {
            text: `${newReply.message}`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to add reply: ${error.message}`,
            type: "error",
          },
          2
        )
      );
    }
  };
};

export const editReply = (content) => {
  return async (dispatch) => {
    try {
      const updatedReply = await replyService.update(content);
      dispatch(updateReply(updatedReply));

      dispatch(
        showMessage(
          {
            text: `Reply edited!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to edit Reply: ${error.message}`,
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
      await replyService.remove(content);
      dispatch(deleteReply(content.reply));

      dispatch(
        showMessage(
          {
            text: `Reply deleted successfully!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 404
          ? `Failed to delete the reply: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(showMessage({ text: errorMessage, type: "error" }, 2));

      if (error.response && error.response.status === 404) {
        dispatch(deleteReply(content));
      }
    }
  };
};

export default replySlice.reducer;
