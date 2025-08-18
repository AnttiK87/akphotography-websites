import { useSelector } from "react-redux";
import { useAppDispatch } from "./useRedux.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setLoginUser } from "../reducers/userReducer.js";

import type { RootState } from "../reducers/store";
import type { LoginResponse } from "../types/loginTypes";

const useNotLoggedin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInStore = useSelector((state: RootState) => state.user.loginUser);
  const userInLocalStorage = localStorage.getItem("loggedAdminUser");

  let parsedUser: LoginResponse | undefined = undefined;

  if (userInLocalStorage && userInLocalStorage != "undefined") {
    try {
      parsedUser = JSON.parse(userInLocalStorage);
    } catch (error) {
      console.error("Error Parsin user from localStorage:", error);
    }
  }

  const user: LoginResponse | undefined = userInStore
    ? userInStore
    : parsedUser
    ? parsedUser
    : undefined;

  useEffect(() => {
    if (!userInStore && !userInLocalStorage) {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!userInStore && parsedUser) {
      dispatch(setLoginUser(parsedUser));
    }
  });

  return { user };
};

export default useNotLoggedin;
