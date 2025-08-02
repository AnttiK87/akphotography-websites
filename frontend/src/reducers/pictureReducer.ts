import { createSlice } from "@reduxjs/toolkit";
import pictureService from "../services/pictures";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosError } from "axios";
import type { Category } from "../types/types";
import type {
  PictureState,
  PictureDetails,
  PicturesBasic,
  UpdatePicture,
} from "../types/pictureTypes";

const initialState: PictureState = {
  allPictures: [],
  monthly: [],
  nature: [],
  birds: [],
  mammals: [],
  landscapes: [],
  latestCategoryPictures: [],
};

const pictureSlice = createSlice({
  name: "pictures",
  initialState,
  reducers: {
    setPictures(state, action: PayloadAction<PictureDetails[]>) {
      state.allPictures = action.payload;
    },
    setMonthly(state, action: PayloadAction<PicturesBasic[]>) {
      state.monthly = action.payload;
    },
    setNature(state, action: PayloadAction<PicturesBasic[]>) {
      state.nature = action.payload;
    },
    setBirds(state, action: PayloadAction<PicturesBasic[]>) {
      state.birds = action.payload;
    },
    setMammals(state, action: PayloadAction<PicturesBasic[]>) {
      state.mammals = action.payload;
    },
    setLandscapes(state, action: PayloadAction<PicturesBasic[]>) {
      state.landscapes = action.payload;
    },
    setLatestCategoryPictures(state, action: PayloadAction<PicturesBasic[]>) {
      state.latestCategoryPictures = action.payload;
    },
    appendPicture(state, action: PayloadAction<PictureDetails>) {
      state.allPictures.push(action.payload);
    },
    updatePicture(state, action: PayloadAction<PictureDetails>) {
      const updatedPicture = action.payload;
      state.allPictures = state.allPictures.map((picture) =>
        picture.id === updatedPicture.id ? updatedPicture : picture
      );
    },
    deletePicture(state, action: PayloadAction<number>) {
      state.allPictures = state.allPictures.filter(
        (picture) => picture.id !== action.payload
      );
      state.latestCategoryPictures = state.latestCategoryPictures.filter(
        (picture) => picture.id !== action.payload
      );
    },
  },
});

export const {
  appendPicture,
  setPictures,
  setMonthly,
  setNature,
  setBirds,
  setMammals,
  setLandscapes,
  setLatestCategoryPictures,
  updatePicture,
  deletePicture,
} = pictureSlice.actions;

export const initializePicturesAllData = (category: Category) => {
  return async (dispatch: AppDispatch) => {
    try {
      const pictures = await pictureService.getAllData(category);
      dispatch(setPictures(pictures));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const initializeCategoryLatest = (category: Category) => {
  return async (dispatch: AppDispatch) => {
    try {
      const latestCategoryPictures = await pictureService.getCategoryLatest(
        category
      );
      dispatch(setLatestCategoryPictures(latestCategoryPictures));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const initializePicturesByCategory = (category: Category) => {
  return async (dispatch: AppDispatch) => {
    try {
      const pictures = await pictureService.getPicturesByCategory(category);
      if (category === "monthly") {
        return dispatch(setMonthly(pictures));
      } else if (category === "nature") {
        return dispatch(setNature(pictures));
      } else if (category === "birds") {
        return dispatch(setBirds(pictures));
      } else if (category === "mammals") {
        return dispatch(setMammals(pictures));
      } else if (category === "landscapes") {
        return dispatch(setLandscapes(pictures));
      }
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const createPicture = (
  content: FormData,
  navigate: NavigateFunction
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const newPicture = await pictureService.create(content);
      dispatch(appendPicture(newPicture.picture));
      dispatch(
        showMessage(
          {
            text: newPicture.message,
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

export const editPicture = (
  content: UpdatePicture,
  navigate: NavigateFunction
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const updatedPicture = await pictureService.update(content);
      dispatch(updatePicture(updatedPicture.picture));

      dispatch(
        showMessage(
          {
            text: updatedPicture.message,
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

export const removePicture = (
  pictureId: number,
  navigate: NavigateFunction
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const deletedPicture = await pictureService.remove(pictureId);
      dispatch(deletePicture(pictureId));

      dispatch(
        showMessage(
          {
            text: deletedPicture.message,
            type: "success",
          },
          1
        )
      );
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deletePicture(pictureId));
      }
    }
  };
};

export default pictureSlice.reducer;
