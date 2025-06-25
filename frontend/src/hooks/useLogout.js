import { useDispatch } from "react-redux";
import { showMessage } from "../reducers/messageReducer";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login";

import { clearUser } from "../reducers/userReducer.js";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(window.localStorage.getItem("loggedAdminUser"));

  const cleanupAndRedirect = () => {
    window.localStorage.removeItem("loggedAdminUser");
    dispatch(clearUser());
    navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      await loginService.logout(user.token);
      cleanupAndRedirect();
      const messageLogout = "Logged out successfully!";
      dispatch(showMessage({ text: messageLogout, type: "success" }, 2));
    } catch (error) {
      console.error("Logout failed:", error);
      cleanupAndRedirect();
      const errorMessage =
        "Logout may have failed on the server, but you've been logged out locally.";
      dispatch(showMessage({ text: errorMessage, type: "warning" }, 2));
    }
  };

  const handleCancelLogin = async () => {
    try {
      await loginService.cancelLogin(user.token);
      cleanupAndRedirect();
      const messageLogout = "Logged out successfully!";
      dispatch(showMessage({ text: messageLogout, type: "success" }, 2));
    } catch (error) {
      console.error("Logout failed:", error);
      cleanupAndRedirect();
      const errorMessage =
        "Logout may have failed on the server, but you've been logged out locally.";
      dispatch(showMessage({ text: errorMessage, type: "warning" }, 2));
    }
  };

  return { handleLogout, handleCancelLogin };
};

export default useLogout;
