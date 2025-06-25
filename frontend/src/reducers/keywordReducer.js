import { createSlice } from "@reduxjs/toolkit";
import keywordService from "../services/keywords";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

const initialState = {
  keywords: [],
};

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

export const initializeKeywords = () => {
  return async (dispatch) => {
    try {
      const keywords = await keywordService.getAll();
      dispatch(setKeywords(keywords));
    } catch (error) {
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

export const editKeyword = (content, language, navigate) => {
  return async (dispatch) => {
    try {
      const updatedKeyword = await keywordService.update(content);
      dispatch(updateKeyword(updatedKeyword.keyword));

      dispatch(
        showMessage(
          {
            text: `${
              language === "fin"
                ? updatedKeyword.messageFi
                : updatedKeyword.messageEn
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
        handleError(error, dispatch, navigate);
      }
    }
  };
};

export const removeKw = (content, language) => {
  return async (dispatch, navigate) => {
    try {
      const deletedKeyword = await keywordService.remove(content);
      dispatch(deleteKeyword(content.keywordId));

      dispatch(
        showMessage(
          {
            text:
              language === "fin"
                ? deletedKeyword.messageFi
                : deletedKeyword.messageEn,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deleteKeyword(content));
      }
    }
  };
};

export default keywordSlice.reducer;
