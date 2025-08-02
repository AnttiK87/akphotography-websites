import { configureStore } from "@reduxjs/toolkit";

import commentReducer from "./commentReducer.js";
import pictureReducer from "./pictureReducer.js";
import ratingReducer from "./ratingReducer.js";
import messageReducer from "./messageReducer.js";
import replyReducer from "./replyReducer.js";
import keywordReducer from "./keywordReducer.js";
import userReducer from "./userReducer.js";

const store = configureStore({
  reducer: {
    comments: commentReducer,
    pictures: pictureReducer,
    ratings: ratingReducer,
    message: messageReducer,
    replies: replyReducer,
    keywords: keywordReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
