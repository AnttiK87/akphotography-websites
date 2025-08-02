import { createSlice } from "@reduxjs/toolkit";
import ratingService from "../services/ratings";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { Rating, AddRating } from "../types/ratingTypes";

interface RatingState {
  ratings: Rating[];
}

const initialState: RatingState = {
  ratings: [],
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setRatings(state, action: PayloadAction<Rating[]>) {
      state.ratings = action.payload;
    },
    appendRating(state, action: PayloadAction<Rating>) {
      state.ratings.push(action.payload);
    },
    updateRating(state, action: PayloadAction<Rating>) {
      const updatedRating = action.payload;
      state.ratings = state.ratings.map((rating) =>
        rating.id === updatedRating.id ? updatedRating : rating
      );
    },
    deleteRating(state, action: PayloadAction<Rating>) {
      state.ratings = state.ratings.filter(
        (rating) => rating.id !== action.payload.id
      );
    },
  },
});

export const { setRatings, appendRating, deleteRating, updateRating } =
  ratingSlice.actions;

export const initializeRatings = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const ratings = await ratingService.getAll(id);
      dispatch(setRatings(ratings));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const createRating = (content: AddRating) => {
  return async (dispatch: AppDispatch) => {
    try {
      const newRating = await ratingService.create(content);
      if (newRating.message === "Rating saved") {
        dispatch(appendRating(newRating.rating));
      } else if (newRating.message === "Rating deleted") {
        dispatch(deleteRating(newRating.rating));
      } else {
        dispatch(updateRating(newRating.rating));
      }
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export default ratingSlice.reducer;
