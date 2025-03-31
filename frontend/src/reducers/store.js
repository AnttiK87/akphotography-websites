//configuring redux store
import { configureStore } from "@reduxjs/toolkit";
import pictureReducer from "./pictureReducer.js";
import ratingReducer from "./ratingReducer.js";
import messageReducer from "./messageReducer.js";
import commentReducer from "./commentReducer.js";
import replyReducer from "./replyReducer.js";
import keywordReducer from "./keywordReducer.js";
import userReducer from "./userReducer";

const store = configureStore({
  reducer: {
    pictures: pictureReducer,
    ratings: ratingReducer,
    message: messageReducer,
    comments: commentReducer,
    replies: replyReducer,
    keywords: keywordReducer,
    user: userReducer,
  },
});

export default store;
