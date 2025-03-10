//reducer for blogs
//depedencies
import { createSlice } from "@reduxjs/toolkit";
import pictureService from "../services/pictures";
import { showMessage } from "./messageReducer";

//create slice
const pictureSlice = createSlice({
  name: "pictures",
  initialState: {
    allPictures: [],
    latestMonthlyPictures: [],
  },
  reducers: {
    appendPicture(state, action) {
      state.allPictures.push(action.payload);
    },
    setPictures(state, action) {
      state.allPictures = action.payload;
    },
    setLatestMonthlyPictures(state, action) {
      state.latestMonthlyPictures = action.payload;
    },
    deletePicture(state, action) {
      state.allPictures = state.allPictures.filter(
        (picture) => picture.id !== action.payload.id
      );
    },
  },
});

export const {
  appendPicture,
  setPictures,
  setLatestMonthlyPictures,
  deletePicture,
} = pictureSlice.actions;

// Setting blogs at db to current state with error handling
export const initializePictures = () => {
  return async (dispatch) => {
    try {
      const pictures = await pictureService.getAll();
      dispatch(setPictures(pictures));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load pictures: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export const initializeMonthlyLatest = () => {
  return async (dispatch) => {
    try {
      const latestMontlyPictures = await pictureService.getMonthlyLatest();
      dispatch(setLatestMonthlyPictures(latestMontlyPictures));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load pictures: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export const initializeMonthly = () => {
  return async (dispatch) => {
    try {
      const pictures = await pictureService.getMonthly();
      dispatch(setPictures(pictures));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load pictures: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

// Creating new blog and setting it to the state with error handling
export const createPicture = (content) => {
  return async (dispatch) => {
    try {
      const newPicture = await pictureService.create(content);
      dispatch(appendPicture(newPicture));

      // show message blog added
      dispatch(
        showMessage(
          {
            text: `Added a new picture!`,
            type: "success",
          },
          5
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to add picture: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export const remove = (content) => {
  return async (dispatch) => {
    try {
      await pictureService.remove(content);
      dispatch(deletePicture(content));

      dispatch(
        showMessage(
          {
            text: `Picture ${content.id} deleted successfully!`,
            type: "success",
          },
          10
        )
      );
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 404
          ? `Failed to delete the picture: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(showMessage({ text: errorMessage, type: "error" }, 10));

      if (error.response && error.response.status === 404) {
        dispatch(deletePicture(content));
      }
    }
  };
};

//export
export default pictureSlice.reducer;
