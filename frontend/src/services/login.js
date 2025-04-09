import axios from "axios";
import picturesService from "../services/pictures";

const baseUrlLogin = "/api/login";
const baseUrlLogout = "/api/logout";

const login = async (credentials) => {
  const response = await axios.post(baseUrlLogin, credentials);
  return response.data;
};

const logout = async () => {
  const token = picturesService.getToken();

  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(baseUrlLogout, config);
  return response.data;
};

export default { login, logout };
