//reducer for comments of the blogs
//depebdencies
import { createSlice } from "@reduxjs/toolkit";
import keywordService from "../services/keywords";
import { showMessage } from "./messageReducer";

const initialState = {
  keywords: [],
};

//create slice
const keywordSlice = createSlice({
  name: "keyword",
  initialState,
  reducers: {
    setKeywords(state, action) {
      state.keywords = action.payload;
    },
    deleteKeyword(state, action) {
      state.keywords = state.keywords.filter(
        (keyword) => keyword.id !== action.payload
      );
    },
  },
});

export const { setKeywords, appendKeyword, deleteKeyword } =
  keywordSlice.actions;

// Setting data to current state with error handling
export const initializeKeywords = () => {
  return async (dispatch) => {
    try {
      const keywords = await keywordService.getAll();
      dispatch(setKeywords(keywords));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load keywords: ${error.message}`,
            type: "error",
          },
          2
        )
      );
    }
  };
};

export const removeKw = (content) => {
  return async (dispatch) => {
    try {
      await keywordService.remove(content);
      dispatch(deleteKeyword(content.keywordId));

      dispatch(
        showMessage(
          {
            text: `Keyword deleted successfully!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 404
          ? `Failed to delete the keyword: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(showMessage({ text: errorMessage, type: "error" }, 2));

      if (error.response && error.response.status === 404) {
        dispatch(deleteKeyword(content));
      }
    }
  };
};

//export
export default keywordSlice.reducer;
