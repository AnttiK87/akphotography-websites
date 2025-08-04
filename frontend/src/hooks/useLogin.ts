import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useRedux.js";
import loginService from "../services/login.js";
import { handleError } from "../utils/handleError";
import {
  setLoginUser,
  setUsername,
  setPassword,
  setFirstLogin,
} from "../reducers/userReducer.js";
import { showMessage } from "../reducers/messageReducer.js";
import { useNavigate } from "react-router-dom";

import type { AxiosError } from "axios";
import type { RootState } from "../reducers/store";
import type { LoginResponse } from "../types/loginTypes.js";

const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const username: string | undefined = useSelector(
    (state: RootState) => state.user.username
  );
  const password: string | undefined = useSelector(
    (state: RootState) => state.user.password
  );
  const firstLogin: boolean = useSelector(
    (state: RootState) => state.user.firstLogin
  );

  const hangleFirstLogin = (firstLoginValue: boolean) => {
    dispatch(setFirstLogin(firstLoginValue));
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let user: LoginResponse;
      if (username && password) {
        user = await loginService.login({
          username,
          password,
        });
      } else {
        throw new Error("Username or password not provided!");
      }

      window.localStorage.setItem("loggedAdminUser", JSON.stringify(user));
      loginService.setToken(user.token);

      dispatch(setLoginUser(user));

      if (user.firstLogin) {
        hangleFirstLogin(user.firstLogin);
      } else {
        dispatch(
          showMessage({ text: `Welcome ${user.name}`, type: "success" }, 2)
        );
      }

      navigate("/admin/editContent");
      dispatch(setUsername(""));
      dispatch(setPassword(""));
    } catch (err: unknown) {
      const error = err as AxiosError;
      handleError(error, dispatch);
    }
  };

  return { handleLogin, hangleFirstLogin, firstLogin };
};

export default useLogin;
