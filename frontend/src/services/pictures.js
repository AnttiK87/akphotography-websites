//HTTP reguests for handling blogs

//dependencies
import axios from "axios";

const baseUrl = "/api/pictures/";

// retrieve all blogs
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// retrieve all blogs
const getMonthly = async () => {
  const response = await axios.get(`${baseUrl}?search=monthly`);
  return response.data;
};

// retrieve all blogs
const getMonthlyLatest = async () => {
  const response = await axios.get(`${baseUrl}latest`);
  return response.data;
};

// create new blog
const create = async (newObject) => {
  const response = await axios.post(`${baseUrl}upload`, newObject);
  return response.data;
};

// delete the blog
const remove = async (content) => {
  const response = await axios.delete(`${baseUrl}/${content.id}`);
  return response.data;
};

// exports
export default { getAll, create, remove, getMonthly, getMonthlyLatest };
