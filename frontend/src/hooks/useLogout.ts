import { useAppDispatch } from "./useRedux.js";
import { showMessage } from "../reducers/messageReducer.js";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login.js";
import { clearLoginUser, clearUser } from "../reducers/userReducer.js";

import type { LoginResponse } from "../types/loginTypes.js";

const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const storedUser = window.localStorage.getItem("loggedAdminUser");

  let parsedUser: LoginResponse | undefined = undefined;

  if (storedUser && storedUser != "undefined") {
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error Parsin user from localStorage:", error);
    }
  }

  const cleanupAndRedirect = () => {
    window.localStorage.removeItem("loggedAdminUser");
    dispatch(clearLoginUser());
    dispatch(clearUser());
    navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      if (parsedUser) {
        await loginService.logout(parsedUser.token);
        cleanupAndRedirect();
        const messageLogout = "Logged out successfully!";
        dispatch(showMessage({ text: messageLogout, type: "success" }, 2));
      } else {
        throw new Error("User missing!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      cleanupAndRedirect();
      const errorMessage =
        "Logout may have failed on the server, but you've been logged out locally.";
      dispatch(showMessage({ text: errorMessage, type: "error" }, 2));
    }
  };

  const handleCancelLogin = async () => {
    try {
      if (parsedUser) {
        await loginService.cancelLogin(parsedUser.token);
        cleanupAndRedirect();
        const messageLogout = "Logged out successfully!";
        dispatch(showMessage({ text: messageLogout, type: "success" }, 2));
      } else {
        throw new Error("User missing!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      cleanupAndRedirect();
      const errorMessage =
        "Logout may have failed on the server, but you've been logged out locally.";
      dispatch(showMessage({ text: errorMessage, type: "error" }, 2));
    }
  };

  return { handleLogout, handleCancelLogin };
};

export default useLogout;
