//configuring redux store
import { configureStore } from "@reduxjs/toolkit";
import pictureReducer from "./pictureReducer.js";
import ratingReducer from "./ratingReducer.js";
import messageReducer from "./messageReducer.js";

const store = configureStore({
  reducer: {
    pictures: pictureReducer,
    ratings: ratingReducer,
    message: messageReducer,
  },
});

export default store;
