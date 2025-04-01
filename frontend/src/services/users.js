//HTTP reguests for handling blogs

//dependencies
import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/users";

// retrieve all blogs
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const updateFirstLogin = async (content) => {
  const token = picturesService.getToken();

  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    name: content.name,
    username: content.username,
    email: content.email,
    oldPassword: content.oldPassword,
    newPassword1: content.newPassword1,
    newPassword2: content.newPassword2,
  };

  const response = await axios.put(
    `${baseUrl}/updateFirstLogin`,
    newObject,
    config
  );
  return response.data;
};

const changePassword = async (content) => {
  const token = picturesService.getToken();

  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    oldPassword: content.oldPassword,
    newPassword1: content.newPassword1,
    newPassword2: content.newPassword2,
  };

  const response = await axios.put(
    `${baseUrl}/changePassword`,
    newObject,
    config
  );
  return response.data;
};

const updateInfo = async (content) => {
  const token = picturesService.getToken();

  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    name: content.name,
    username: content.username,
    email: content.email,
  };

  const response = await axios.put(`${baseUrl}/updateInfo`, newObject, config);
  return response.data;
};

// exports
export default {
  getAll,
  getUserById,
  updateFirstLogin,
  changePassword,
  updateInfo,
};
