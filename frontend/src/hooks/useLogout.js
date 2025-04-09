import { useDispatch } from "react-redux";
import { clearUser } from "../reducers/userReducer.js";
import { showMessage } from "../reducers/messageReducer";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await loginService.logout();
      window.localStorage.clear("loggedAdminUser");

      dispatch(clearUser());

      navigate("/admin");

      const messageLogout = "Logged out successfully!";
      dispatch(showMessage({ text: messageLogout, type: "success" }, 2));
    } catch (error) {
      console.error("Logout failed:", error);
      const errorMessage = "An error occurred during logout. Please try again.";
      dispatch(showMessage({ text: errorMessage, type: "error" }, 2));
    }
  };

  return { handleLogout };
};

export default useLogout;
