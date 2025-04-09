import axios from "axios";

const baseUrl = "/api/ratings";

const getAll = async (id) => {
  const response = await axios.get(`${baseUrl}?search=${id}`);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

export default { getAll, create };
