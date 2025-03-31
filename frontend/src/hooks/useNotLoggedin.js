//dependencies
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useNotLoggedin = () => {
  const navigate = useNavigate();
  const userInStore = useSelector((state) => state.user.user);
  const user = !userInStore
    ? localStorage.getItem("loggedAdminUser")
    : userInStore;

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      return;
    }
  }, [user, navigate]);

  return { user };
};

export default useNotLoggedin;
