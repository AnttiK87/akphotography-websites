import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "./store";

interface Message {
  text: string;
  type: "success" | "error";
}

type MessageState = Message | null;

const initialState: MessageState = null;

const messageSlice = createSlice({
  name: "message",
  initialState: initialState as MessageState,
  reducers: {
    setMessage(_state, action: PayloadAction<Message | null>) {
      return action.payload;
    },
  },
});

export const { setMessage } = messageSlice.actions;

export const showMessage = (message: Message, displayTime: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(setMessage(message));

    setTimeout(() => {
      dispatch(setMessage(null));
    }, displayTime * 1000);
  };
};

export default messageSlice.reducer;
