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

// Setting blogs at db to current state with error handling
export const initializePicturesAllData = (category) => {
  return async (dispatch) => {
    try {
      const pictures = await pictureService.getAllData(category);
      dispatch(setPictures(pictures));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load pictures: ${error.message}`,
            type: "error",
          },
          1
        )
      );
    }
  };
};

export const initializeCategoryLatest = (category) => {
  //console.log(`category reducer: ${category}`);
  return async (dispatch) => {
    try {
      const latestCategoryPictures = await pictureService.getCategoryLatest(
        category
      );
      //console.log(`latest: ${JSON.stringify(latestCategoryPictures)}`);
      dispatch(setLatestCategoryPictures(latestCategoryPictures));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load pictures: ${error.message}`,
            type: "error",
          },
          1
        )
      );
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
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load pictures: ${error.message}`,
            type: "error",
          },
          3
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
          1
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to add picture: ${error.message}`,
            type: "error",
          },
          3
        )
      );
    }
  };
};

export const editPicture = (content) => {
  return async (dispatch) => {
    try {
      //console.log("this update indeed happens");
      const updatedPicture = await pictureService.update(content);
      //console.log(`updated picture: ${JSON.stringify(updatedPicture)}`);
      dispatch(updatePicture(updatedPicture));

      dispatch(
        showMessage(
          {
            text: `Picture edited!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to edit Picture: ${error.message}`,
            type: "error",
          },
          3
        )
      );
    }
  };
};

export const removePicture = (pictureId) => {
  return async (dispatch) => {
    try {
      await pictureService.remove(pictureId);
      dispatch(deletePicture(pictureId));

      dispatch(
        showMessage(
          {
            text: `PictureId: ${pictureId} deleted successfully!`,
            type: "success",
          },
          1
        )
      );
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 404
          ? `Failed to delete the picture: ${error.message}`
          : `An unexpected error occurred: ${error.message}`;

      dispatch(showMessage({ text: errorMessage, type: "error" }, 3));

      if (error.response && error.response.status === 404) {
        dispatch(deletePicture(pictureId));
      }
    }
  };
};

//export
export default pictureSlice.reducer;
