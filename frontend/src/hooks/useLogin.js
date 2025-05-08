import { useDispatch, useSelector } from "react-redux";
import loginService from "../services/login";
import pictureService from "../services/pictures.js";
import {
  setUser,
  setUsername,
  setPassword,
  setFirstLogin,
} from "../reducers/userReducer.js";
import { showMessage } from "../reducers/messageReducer";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username);
  const password = useSelector((state) => state.user.password);
  const firstLogin = useSelector((state) => state.user.firstLogin);

  const hangleFirstLogin = (firstLoginValue) => {
    dispatch(setFirstLogin(firstLoginValue));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedAdminUser", JSON.stringify(user));
      pictureService.setToken(user.token);

      dispatch(setUser(user));

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
    } catch (exception) {
      var errorMessage;

      if (exception.response && exception.response.status === 401) {
        errorMessage = "Wrong username or password!";
        dispatch(setUsername(""));
        dispatch(setPassword(""));
      } else if (exception.response) {
        errorMessage = `Error: ${exception.response.data.error}`;
      } else {
        errorMessage = ` ${exception.response.data.error}`;
      }

      dispatch(showMessage({ text: errorMessage, type: "error" }, 3));
    }
  };

  return { handleLogin, hangleFirstLogin, firstLogin };
};

export default useLogin;
