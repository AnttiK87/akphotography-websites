import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/replies";

// retrieve all comments
const getAll = async (pictureId) => {
  const response = await axios.get(`${baseUrl}?search=${pictureId}`);
  return response.data;
};

// add new comment
const create = async (newObject) => {
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

// update the comment
const update = async (content) => {
  const token = picturesService.getToken();
  const config = {
    headers: { Authorization: token },
  };
  console.log(`edit reply: ${JSON.stringify(content)}`);
  const newObject = {
    reply: content.formData.reply,
    username: content.formData.username,
    referenceUserId: content.userId,
  };

  const response = await axios.put(
    `${baseUrl}/${content.commentId}`,
    newObject,
    config
  );
  return response.data;
};

const remove = async (content) => {
  console.log("reply content: ", JSON.stringify(content));
  const token = picturesService.getToken();
  const config = token
    ? {
        headers: { Authorization: token },
        data: content,
      }
    : {
        data: content,
      };
  const response = await axios.delete(`${baseUrl}/${content.reply.id}`, config);

  return response.data;
};

export default { getAll, create, remove, update };
