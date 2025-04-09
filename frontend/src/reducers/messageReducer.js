import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: null,
  reducers: {
    setMessages(state, action) {
      return action.payload;
    },
  },
});

export const { setMessages } = messageSlice.actions;

export const showMessage = (message, displayTime) => {
  return async (dispatch) => {
    let timeoutId;

    dispatch(setMessages(message));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch(setMessages(null));
      timeoutId = null;
    }, displayTime * 1000);
  };
};

export default messageSlice.reducer;
