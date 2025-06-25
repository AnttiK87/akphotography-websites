//HTTP reguests for handling blogs
import axios from "axios";

const baseUrl = "/api/pictures/";

const storedUser = localStorage.getItem("loggedAdminUser");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

let token = parsedUser ? `Bearer ${parsedUser.token}` : null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => token;

const getAllData = async (category) => {
  const response = await axios.get(`${baseUrl}/allData/?search=${category}`);
  return response.data;
};

const getPicturesByCategory = async (category) => {
  const response = await axios.get(`${baseUrl}?search=${category}`);
  return response.data;
};

const getCategoryLatest = async (category) => {
  const response = await axios.get(`${baseUrl}latest/?search=${category}`);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(`${baseUrl}upload`, newObject, config);
  return response.data;
};

const update = async (content) => {
  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    type: content.formData.type,
    textFi: content.formData.textFi,
    textEn: content.formData.textEn,
    keywords: content.formData.keywords,
    month: content.formData.month,
    year: content.formData.year,
  };

  const response = await axios.put(
    `${baseUrl}${content.pictureId}`,
    newObject,
    config
  );
  return response.data;
};

const addView = async (pictureId) => {
  const response = await axios.put(`${baseUrl}addView/${pictureId}`);
  return response.data;
};

const remove = async (pictureId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}${pictureId}`, config);
  return response.data;
};

export default {
  setToken,
  getAllData,
  create,
  update,
  remove,
  getPicturesByCategory,
  getCategoryLatest,
  getToken,
  addView,
};
