import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/replies";

const getAll = async (pictureId) => {
  const response = await axios.get(`${baseUrl}?search=${pictureId}`);
  return response.data;
};

const create = async (newObject) => {
  let config;
  if (newObject.adminReply) {
    const token = picturesService.getToken();
    config = {
      headers: { Authorization: token },
    };
  }

  const response = await axios.post(`${baseUrl}`, newObject, config);
  return response.data;
};

const update = async (content) => {
  const token = picturesService.getToken();
  const config = {
    headers: { Authorization: token },
  };
  const newObject = {
    reply: content.formData.reply,
    username: content.formData.username,
    userId: content.userId,
  };

  const response = await axios.put(
    `${baseUrl}/${content.commentId}`,
    newObject,
    config
  );
  return response.data;
};

const remove = async (content) => {
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
