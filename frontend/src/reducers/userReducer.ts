import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";
import { showMessage } from "./messageReducer";
import { handleError } from "../utils/handleError";

import type { AppDispatch } from "./store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { LoginResponse } from "../types/loginTypes";
import type {
  UserState,
  FirstLogin,
  ChangePassword,
  UpdateInfo,
  User,
} from "../types/userTypes";

const storedUser = localStorage.getItem("loggedAdminUser");
let parsedUser: LoginResponse | undefined = undefined;
if (storedUser && storedUser != "undefined") {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (error) {
    console.error("Error while parsin user from localStorage:", error);
  }
}

const initialState: UserState = {
  username: parsedUser?.username || undefined,
  token: parsedUser?.token || undefined,
  name: parsedUser?.name || undefined,
  email: parsedUser?.email || undefined,
  firstLogin: parsedUser?.firstLogin || false,
  lastLogin: parsedUser?.lastLogin || undefined,
  password: undefined,
  loginUser: undefined,
  user: undefined,
  profilePicture: parsedUser?.profilePicture || undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setFirstLogin(state, action: PayloadAction<boolean>) {
      state.firstLogin = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setLoginUser(state, action: PayloadAction<LoginResponse>) {
      state.loginUser = action.payload;
      state.profilePicture = action.payload.profilePicture;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearLoginUser(state) {
      state.loginUser = undefined;
    },
    clearUser(state) {
      state.user = undefined;
    },
    updateUser(state, action) {
      const updatedUser = action.payload;
      if (state.loginUser) {
        state.loginUser.username = updatedUser.username;
        state.loginUser.name = updatedUser.name;
        state.loginUser.email = updatedUser.email;
        localStorage.setItem("loggedAdminUser", JSON.stringify(state.user));
      } else {
        throw new Error("User missing!");
      }
    },
    updateProfPic(state, action: PayloadAction<string>) {
      state.profilePicture = action.payload;
    },
  },
});

export const {
  setUsername,
  setPassword,
  setLoginUser,
  setUser,
  clearLoginUser,
  clearUser,
  updateUser,
  setFirstLogin,
  updateProfPic,
} = userSlice.actions;

export const getUser = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await userService.getUserById(id);
      dispatch(setUser(user));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const modifyUser = (content: FirstLogin) => {
  return async (dispatch: AppDispatch) => {
    try {
      const newUser = await userService.updateFirstLogin(content);
      dispatch(updateUser(newUser));

      dispatch(
        showMessage(
          {
            text: `Welcome ${newUser.user.name}!`,
            type: "success",
          },
          5
        )
      );
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const changePassword = (content: ChangePassword) => {
  return async (dispatch: AppDispatch) => {
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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const updateUserInfo = (content: UpdateInfo) => {
  return async (dispatch: AppDispatch) => {
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
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export const changeProfPicture = (content: FormData) => {
  return async (dispatch: AppDispatch) => {
    try {
      const profPic = await userService.changeProfPic(content);
      dispatch(updateProfPic(profPic.newProfPic));

      dispatch(
        showMessage(
          {
            text: `Profile picture changed!`,
            type: "success",
          },
          5
        )
      );
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };
};

export default userSlice.reducer;
