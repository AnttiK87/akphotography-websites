import axios from "axios";

const baseUrl = "/api/contact/";

const sendMail = async (newObject) => {
  console.log(`new contact: ${JSON.stringify(newObject)}`);
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

export default { sendMail };
