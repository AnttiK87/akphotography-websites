import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";
import { showMessage } from "./messageReducer";

const storedUser = localStorage.getItem("loggedAdminUser");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  username: parsedUser?.username || "",
  token: parsedUser?.token || "",
  name: parsedUser?.name || "",
  email: parsedUser?.email || "",
  firstLogin: parsedUser?.firstLogin || false,
  lastLogin: parsedUser?.lastLogin || "",
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
      state.user = null;
    },
    updateUser(state, action) {
      const updatedUser = action.payload;
      state.user.username = updatedUser.username;
      state.user.name = updatedUser.name;
      state.user.email = updatedUser.email;
      localStorage.setItem("loggedAdminUser", JSON.stringify(state.user));
    },
  },
});

export const {
  setUsername,
  setPassword,
  setUser,
  clearUser,
  updateUser,
  setFirstLogin,
} = userSlice.actions;

export const getUser = (id) => {
  return async (dispatch) => {
    try {
      const user = await userService.getUserById(id);
      dispatch(setUser(user));
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
      dispatch(updateUser(updatedUser.user));

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
      let errorMessage = "Unknown error occurred.";

      if (error.response.data.messages) {
        errorMessage = error.response.data.messages[0].message;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      dispatch(
        showMessage(
          {
            text: `Failed to change password: ${errorMessage}`,
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
      dispatch(updateUser(updatedUser.user));

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
