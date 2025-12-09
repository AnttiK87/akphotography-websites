import { createSlice } from "@reduxjs/toolkit";
import uiComponenService from "../services/uiComponents";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { UiText, UpdateUiText } from "../types/uiTextTypes";

interface UiTextState {
  uiTexts: UiText[];
}

const initialState: UiTextState = {
  uiTexts: [],
};

const replySlice = createSlice({
  name: "uiText",
  initialState,
  reducers: {
    setUiTexts(state, action: PayloadAction<UiText[]>) {
      state.uiTexts = action.payload;
    },
    appendUiText(state, action: PayloadAction<UiText>) {
      state.uiTexts.push(action.payload);
    },
    updateUiText(state, action: PayloadAction<UiText>) {
      const updatedUiText = action.payload;
      state.uiTexts = state.uiTexts.map((uiText) =>
        uiText.id === updatedUiText.id ? updatedUiText : uiText
      );
    },
  },
});

export const { setUiTexts, appendUiText, updateUiText } = replySlice.actions;

export const initializesUiTexts = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiTexts = await uiComponenService.getUiTexts();
      dispatch(setUiTexts(uiTexts));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const createUiText = (content: UiText) => {
  return async (dispatch: AppDispatch) => {
    try {
      const newUiText = await uiComponenService.newUiText(content);

      dispatch(appendUiText(newUiText.uiText));

      dispatch(
        showMessage(
          {
            text: newUiText.messageEn,
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

export const editUiText = (content: UpdateUiText) => {
  return async (dispatch: AppDispatch) => {
    try {
      const updatedUiText = await uiComponenService.updateUiText(content);
      dispatch(updateUiText(updatedUiText.uiText));

      dispatch(
        showMessage(
          {
            text: updatedUiText.messageEn,
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

export default replySlice.reducer;
