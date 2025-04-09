import { createSlice } from "@reduxjs/toolkit";
import ratingService from "../services/ratings";
import { showMessage } from "./messageReducer";

const initialState = {
  ratings: [],
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setRatings(state, action) {
      state.ratings = action.payload;
    },
    appendRating(state, action) {
      state.ratings.push(action.payload);
    },
    updateRating(state, action) {
      const updatedRating = action.payload;
      state.ratings = state.ratings.map((rating) =>
        rating.id === updatedRating.id ? updatedRating : rating
      );
    },
    deleteRating(state, action) {
      state.ratings = state.ratings.filter(
        (rating) => rating.id !== action.payload.id
      );
    },
  },
});

export const { setRatings, appendRating, deleteRating, updateRating } =
  ratingSlice.actions;

export const initializeRatings = (id) => {
  return async (dispatch) => {
    try {
      const ratings = await ratingService.getAll(id);
      dispatch(setRatings(ratings));
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to load ratingss: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export const createRating = (content) => {
  return async (dispatch) => {
    try {
      const newRating = await ratingService.create(content);

      if (newRating.message === "Rating saved" && newRating.rating.id) {
        dispatch(appendRating(newRating.rating));
      } else if (newRating.message === "Rating deleted" && newRating.id) {
        dispatch(deleteRating(newRating));
      } else {
        dispatch(updateRating(newRating.rating));
      }
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to add rating: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export default ratingSlice.reducer;
