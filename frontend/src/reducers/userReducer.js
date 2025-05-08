import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";
import { showMessage } from "./messageReducer";

const storedUser = localStorage.getItem("loggedAdminUser");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  username: parsedUser?.username || "",
  name: parsedUser?.name || "",
  password: "",
  user: parsedUser,
  firstLogin: parsedUser?.firstLogin || false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
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

export const getUser = (id) => {
  return async (dispatch) => {
    try {
      const user = await userService.getUserById(id);
      dispatch(setSelectedUser(user));
    } catch (error) {
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

export const modifyUser = (content) => {
  return async (dispatch) => {
    try {
      const newUser = await userService.updateFirstLogin(content);
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

export const changePassword = (content) => {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.changePassword(content);
      dispatch(updateUser(updatedUser));

      dispatch(
        showMessage(
          {
            text: `Password changed!`,
            type: "success",
          },
          5
        )
      );
    } catch (error) {
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

export const updateUserInfo = (content) => {
  return async (dispatch) => {
    try {
      const updatedUser = await userService.updateInfo(content);
      dispatch(updateUser(updatedUser));

      dispatch(
        showMessage(
          {
            text: `User information changed!`,
            type: "success",
          },
          5
        )
      );
    } catch (error) {
      dispatch(
        showMessage(
          {
            text: `Failed to change user information ${error.message}`,
            type: "error",
          },
          5
        )
      );
    }
  };
};

export default userSlice.reducer;
