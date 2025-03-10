import axios from "axios";

const baseUrl = "/api/ratings";

// retrieve all ratings
const getAll = async (id) => {
  const response = await axios.get(`${baseUrl}?search=${id}`);
  return response.data;
};

// add new rating
const create = async (newObject) => {
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

export default { getAll, create };
