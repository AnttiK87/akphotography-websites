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

const update = async (content) => {
  const token = picturesService.getToken();
  console.log(
    "you are here on services and token is",
    token,
    "and content:",
    JSON.stringify(content)
  );
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

  const response = await axios.put(`${baseUrl}/update`, newObject, config);
  return response.data;
};

// exports
export default { getAll, getUserById, update };
