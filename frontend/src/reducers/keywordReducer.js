//reducer for comments of the blogs
//depebdencies
import { createSlice } from "@reduxjs/toolkit";
import keywordService from "../services/keywords";
import { showMessage } from "./messageReducer";
import { clearUser } from "./userReducer.js";

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
    updateKeyword(state, action) {
      const updatedKeyword = action.payload;
      state.keywords = state.keywords.map((keyword) =>
        keyword.id === updatedKeyword.id ? updatedKeyword : keyword
      );
    },
    deleteKeyword(state, action) {
      state.keywords = state.keywords.filter(
        (keyword) => keyword.id !== action.payload
      );
    },
  },
});

export const { setKeywords, updateKeyword, deleteKeyword } =
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

export const editKeyword = (content) => {
  return async (dispatch) => {
    try {
      //console.log("this update indeed happens");
      const updatedKeyword = await keywordService.update(content);
      //console.log(`updated picture: ${JSON.stringify(updatedPicture)}`);
      dispatch(updateKeyword(updatedKeyword));

      dispatch(
        showMessage(
          {
            text: `Keyword edited!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("loggedAdminUser");
        window.location.href = "/admin";
        dispatch(clearUser());
      }
      dispatch(
        showMessage(
          {
            text: `Failed to edit Picture: ${
              error.response && error.response.status === 401
                ? `Failed to delete the keyword: ${error.response.data.error}`
                : `An unexpected error occurred: ${error.message}`
            }`,
            type: "error",
          },
          3
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
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("loggedAdminUser");
        window.location.href = "/admin";
        dispatch(clearUser());
      }
      const errorMessage1 =
        error.response && error.response.status === 404
          ? `Failed to delete the keyword: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      const errorMessage2 =
        error.response && error.response.status === 401
          ? `Failed to delete the keyword: ${error.response.data.error}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(
        showMessage(
          {
            text: errorMessage1 ? errorMessage1 : errorMessage2,
            type: "error",
          },
          2
        )
      );

      if (error.response && error.response.status === 404) {
        dispatch(deleteKeyword(content));
      }
    }
  };
};

//export
export default keywordSlice.reducer;
