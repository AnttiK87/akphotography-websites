import axios from "axios";

const baseUrl = "/api/contact/";

const sendMail = async (newObject) => {
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

export default { sendMail };
