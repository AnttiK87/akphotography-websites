//reducer for comments of the blogs
//depebdencies
import { createSlice } from "@reduxjs/toolkit";
import ratingService from "../services/ratings";
import { showMessage } from "./messageReducer";

const initialState = {
  ratings: [],
};

//create slice
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
      console.log(`rating state before: ${JSON.stringify(state)}`);
      state.ratings = state.ratings.filter(
        (rating) => rating.id !== action.payload.id
      );
      console.log(`rating state after: ${JSON.stringify(state)}`);
    },
  },
});

export const { setRatings, appendRating, deleteRating, updateRating } =
  ratingSlice.actions;

// Setting comments at db to current state with error handling
export const initializeRatings = (id) => {
  return async (dispatch) => {
    try {
      const ratings = await ratingService.getAll(id);
      dispatch(setRatings(ratings));
    } catch (error) {
      // handle possible error and show error message
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

// Creating new comment and setting it to the state with error handling
export const createRating = (content) => {
  return async (dispatch) => {
    try {
      const newRating = await ratingService.create(content);
      //console.log(`new rating: ${JSON.stringify(newRating)}`);
      console.log(`new rating id: ${newRating.id}`);

      if (newRating.message === "Rating saved" && newRating.rating.id) {
        dispatch(appendRating(newRating.rating));
      } else if (newRating.message === "Rating deleted" && newRating.id) {
        dispatch(deleteRating(newRating));
      } else {
        dispatch(updateRating(newRating.rating));
      }
    } catch (error) {
      // handle error and show error message
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

//export
export default ratingSlice.reducer;
