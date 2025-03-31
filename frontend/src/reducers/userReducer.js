//reducer for blogs
//depedencies
import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";
import { showMessage } from "./messageReducer";

//create slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    name: "",
    password: "",
    user: null,
    firstLogin: false,
  },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setFirstLogin(state, action) {
      state.firstLogin = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.username = "";
      state.password = "";
      state.user = null;
    },
    updateUser(state, action) {
      const updatedUser = action.payload;
      state.user = updatedUser;
    },
  },
});

//exports
export const {
  setUsername,
  setPassword,
  setUser,
  clearUser,
  setUsers,
  setSelectedUser,
  updateUser,
  setFirstLogin,
} = userSlice.actions;

//get user by id
export const getUser = (id) => {
  return async (dispatch) => {
    try {
      const user = await userService.getUserById(id);
      //console.log(users)
      dispatch(setSelectedUser(user));
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to load user: ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

// Creating new user and setting it to the state with error handling
export const modifyUser = (content) => {
  console.log("tries to modify user with data:", JSON.stringify(content));
  return async (dispatch) => {
    try {
      const newUser = await userService.update(content);
      dispatch(updateUser(newUser));

      dispatch(
        showMessage(
          {
            text: `Welcome ${newUser.name}!`,
            type: "success",
          },
          5
        )
      );
    } catch (error) {
      // handle possible error and show error message
      dispatch(
        showMessage(
          {
            text: `Failed to change user info ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

//export
export default userSlice.reducer;
