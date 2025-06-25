import { createSlice } from "@reduxjs/toolkit";
import pictureService from "../services/pictures";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

const pictureSlice = createSlice({
  name: "pictures",
  initialState: {
    allPictures: [],
    monthly: [],
    nature: [],
    birds: [],
    mammals: [],
    landscapes: [],
    latestCategoryPictures: [],
  },
  reducers: {
    appendPicture(state, action) {
      state.allPictures.push(action.payload);
    },
    setPictures(state, action) {
      state.allPictures = action.payload;
    },
    setMonthly(state, action) {
      state.monthly = action.payload;
    },
    setNature(state, action) {
      state.nature = action.payload;
    },
    setBirds(state, action) {
      state.birds = action.payload;
    },
    setMammals(state, action) {
      state.mammals = action.payload;
    },
    setLandscapes(state, action) {
      state.landscapes = action.payload;
    },
    setLatestCategoryPictures(state, action) {
      state.latestCategoryPictures = action.payload;
    },
    updatePicture(state, action) {
      const updatedPicture = action.payload;
      state.allPictures = state.allPictures.map((picture) =>
        picture.id === updatedPicture.id ? updatedPicture : picture
      );
    },
    deletePicture(state, action) {
      state.allPictures = state.allPictures.filter(
        (picture) => picture.id !== action.payload
      );
      state.latestCategoryPictures = state.latestCategoryPictures.filter(
        (picture) => picture.id !== action.payload.id
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

export const initializePicturesAllData = (category) => {
  return async (dispatch) => {
    try {
      const pictures = await pictureService.getAllData(category);
      dispatch(setPictures(pictures));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const initializeCategoryLatest = (category) => {
  return async (dispatch) => {
    try {
      const latestCategoryPictures = await pictureService.getCategoryLatest(
        category
      );
      dispatch(setLatestCategoryPictures(latestCategoryPictures));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const initializePicturesByCategory = (category) => {
  return async (dispatch) => {
    try {
      const pictures = await pictureService.getPicturesByCategory(category);
      if (category === "monthly") {
        dispatch(setMonthly(pictures));
        return;
      } else if (category === "nature") {
        dispatch(setNature(pictures));
        return;
      } else if (category === "birds") {
        dispatch(setBirds(pictures));
        return;
      } else if (category === "mammals") {
        dispatch(setMammals(pictures));
        return;
      } else if (category === "landscapes") {
        dispatch(setLandscapes(pictures));
        return;
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const createPicture = (content, navigate) => {
  return async (dispatch) => {
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
    } catch (error) {
      handleError(error, dispatch, navigate);
    }
  };
};

export const editPicture = (content, navigate) => {
  return async (dispatch) => {
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
    } catch (error) {
      handleError(error, dispatch, navigate);
    }
  };
};

export const removePicture = (pictureId, navigate) => {
  return async (dispatch) => {
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
    } catch (error) {
      handleError(error, dispatch, navigate);

      if (error.response && error.response.status === 404) {
        dispatch(deletePicture(pictureId));
      }
    }
  };
};

export default pictureSlice.reducer;
