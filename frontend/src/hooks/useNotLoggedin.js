//dependencies
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useNotLoggedin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInStore = useSelector((state) => state.user.user);
  const userInLocalStorage = JSON.parse(
    localStorage.getItem("loggedAdminUser") || "null"
  );
  const [user, setUser] = useState(userInStore);

  useEffect(() => {
    if (!user && !userInStore && !userInLocalStorage) {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!user && userInStore) {
      setUser(userInStore);
    } else if (!user && !userInStore && userInLocalStorage) {
      setUser(userInLocalStorage);
    }
  }, [user, userInStore, userInLocalStorage, dispatch, navigate]);

  return { user };
};

export default useNotLoggedin;
