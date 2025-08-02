import axios from "axios";
import type {
  Credentials,
  LoginResponse,
  LogoutResponse,
} from "../types/loginTypes";

const baseUrlLogin = "/api/login";
const baseUrlLogout = "/api/logout";

const storedUser = window.localStorage.getItem("loggedAdminUser");

let parsedUser: LoginResponse | undefined = undefined;

if (storedUser && storedUser != "undefined") {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (error) {
    console.error("Error while parsin user from localStorage:", error);
  }
}
let token = parsedUser ? `Bearer ${parsedUser.token}` : undefined;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => token;

const login = async (credentials: Credentials): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(baseUrlLogin, credentials);
  return response.data;
};

const logout = async (token: string): Promise<LogoutResponse> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.delete<LogoutResponse>(baseUrlLogout, config);
  return response.data;
};

const cancelLogin = async (token: string): Promise<LogoutResponse> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.delete<LogoutResponse>(
    `${baseUrlLogout}/cancelFirstLogin`,
    config
  );
  return response.data;
};

export default { setToken, getToken, login, logout, cancelLogin };
