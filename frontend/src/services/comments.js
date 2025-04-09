import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/comments";

const getAll = async (id) => {
  const response = await axios.get(`${baseUrl}?search=${id}`);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

const update = async (content) => {
  const newObject = {
    comment: content.formData.comment,
    username: content.formData.username,
    referenceUserId: content.userId,
  };

  const response = await axios.put(
    `${baseUrl}/${content.commentId}`,
    newObject
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
  const response = await axios.delete(
    `${baseUrl}/${content.comment.id}`,
    config
  );

  return response.data;
};

export default { getAll, create, remove, update };
