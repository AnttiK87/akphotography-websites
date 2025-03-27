//HTTP reguests for handling blogs

//dependencies
import axios from "axios";

const baseUrl = "/api/pictures/";

// retrieve all blogs
const getAllData = async (category) => {
  const response = await axios.get(`${baseUrl}/allData/?search=${category}`);
  return response.data;
};

// retrieve all blogs
const getPicturesByCategory = async (category) => {
  const response = await axios.get(`${baseUrl}?search=${category}`);
  return response.data;
};

// retrieve all blogs
const getCategoryLatest = async (category) => {
  console.log(`category ${category}`);
  const response = await axios.get(`${baseUrl}latest/?search=${category}`);
  return response.data;
};

// create new blog
const create = async (newObject) => {
  const response = await axios.post(`${baseUrl}upload`, newObject);
  return response.data;
};

// update the comment
const update = async (content) => {
  console.log(`edit picture: ${JSON.stringify(content)}`);
  const newObject = {
    type: content.formData.type,
    textFi: content.formData.textFi,
    textEn: content.formData.textEn,
    keywords: content.formData.keywords,
    month: content.formData.month,
    year: content.formData.year,
  };

  const response = await axios.put(`${baseUrl}${content.pictureId}`, newObject);
  return response.data;
};

// delete the blog
const remove = async (pictureId) => {
  console.log(`id in services: ${pictureId}`);
  const response = await axios.delete(`${baseUrl}${pictureId}`);
  return response.data;
};

// exports
export default {
  getAllData,
  create,
  update,
  remove,
  getPicturesByCategory,
  getCategoryLatest,
};
