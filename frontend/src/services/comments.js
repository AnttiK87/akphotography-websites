import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/comments";

// retrieve all comments
const getAll = async (id) => {
  const response = await axios.get(`${baseUrl}?search=${id}`);
  return response.data;
};

// add new comment
const create = async (newObject) => {
  console.log(`new comment: ${JSON.stringify(newObject)}`);
  const response = await axios.post(`${baseUrl}`, newObject);
  return response.data;
};

// update the comment
const update = async (content) => {
  console.log("you called me to update comment, sir!");

  const newObject = {
    comment: content.formData.comment,
    username: content.formData.username,
    referenceUserId: content.userId,
  };

  console.log(`updated comment: ${JSON.stringify(newObject)}`);

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
