//reducer for messages
//dependencies
import { createSlice } from '@reduxjs/toolkit'

//create slice
const messageSlice = createSlice({
  name: 'message',
  initialState: null,
  reducers: {
    setMessages(state, action) {
      return action.payload
    },
  },
})

//exports
export const { setMessages } = messageSlice.actions

//function for showing and hiding message after a delay
//takes message and display time as parameters
export const showMessage = (message, displayTime) => {
  return async (dispatch) => {
    let timeoutId

    dispatch(setMessages(message))

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(setMessages(null))
      timeoutId = null
    }, displayTime * 1000)
  }
}

//export
export default messageSlice.reducer
