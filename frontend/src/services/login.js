import axios from "axios";

const baseUrlLogin = "/api/login";
const baseUrlLogout = "/api/logout";

const login = async (credentials) => {
  const response = await axios.post(baseUrlLogin, credentials);
  return response.data;
};

const logout = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.delete(baseUrlLogout, config);
  return response.data;
};

export default { login, logout };
