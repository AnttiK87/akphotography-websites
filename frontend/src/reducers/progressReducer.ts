import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "./store";

interface Progress {
  progress: number;
  ms: number;
}

type ProgressState = Progress | null;

const initialState: ProgressState = null;

const progressSlice = createSlice({
  name: "progress",
  initialState: initialState as ProgressState,
  reducers: {
    setProgress(_state, action: PayloadAction<Progress | null>) {
      return action.payload;
    },
  },
});

export const { setProgress } = progressSlice.actions;

export const showProgress = (progress: Progress) => {
  return (dispatch: AppDispatch) => {
    dispatch(setProgress(progress));
  };
};

export default progressSlice.reducer;
