//dependencies
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../reducers/userReducer.js";

const useNotLoggedin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInStore = useSelector((state) => state.user.user);
  const userInLocalStorage = JSON.parse(
    localStorage.getItem("loggedAdminUser") || "null"
  );
  const user = userInLocalStorage;

  useEffect(() => {
    if (!userInStore && !userInLocalStorage) {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!userInStore && userInLocalStorage) {
      dispatch(setUser(userInLocalStorage));
    }
  }, [userInStore, userInLocalStorage, dispatch, navigate]);

  return { user };
};

export default useNotLoggedin;
