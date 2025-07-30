import { createSlice } from "@reduxjs/toolkit";
import keywordService from "../services/keywords";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../types/types";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosError } from "axios";
import type {
  Keyword,
  KeywordUpdate,
  KeywordDelete,
} from "../types/keywordTypes";

interface KeywordState {
  keywords: Keyword[];
}

const initialState: KeywordState = {
  keywords: [],
};

const keywordSlice = createSlice({
  name: "keyword",
  initialState,
  reducers: {
    setKeywords(state, action: PayloadAction<Keyword[]>) {
      state.keywords = action.payload;
    },
    updateKeyword(state, action: PayloadAction<Keyword>) {
      const updatedKeyword = action.payload;
      state.keywords = state.keywords.map((keyword) =>
        keyword.id === updatedKeyword.id ? updatedKeyword : keyword
      );
    },
    deleteKeyword(state, action: PayloadAction<KeywordDelete>) {
      state.keywords = state.keywords.filter(
        (keyword) => keyword.id !== action.payload.keywordId
      );
    },
  },
});

export const { setKeywords, updateKeyword, deleteKeyword } =
  keywordSlice.actions;

export const initializeKeywords = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const keywords = await keywordService.getAll();
      dispatch(setKeywords(keywords));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const editKeyword = (
  content: KeywordUpdate,
  language: Language,
  navigate: NavigateFunction
) => {
  return async (dispatch: AppDispatch) => {
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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch, navigate);
    }
  };
};

export const removeKw = (
  content: KeywordDelete,
  language: Language,
  navigate: NavigateFunction
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const deletedKeyword = await keywordService.remove(content);
      dispatch(deleteKeyword(content));

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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deleteKeyword(content));
      }
    }
  };
};

export default keywordSlice.reducer;
