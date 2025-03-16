import axios from "axios";

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
  console.log(`edit reply: ${JSON.stringify(content)}`);
  const newObject = {
    reply: content.formData.reply,
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
  const response = await axios.delete(`${baseUrl}/${content.reply.id}`, {
    data: content,
  });

  return response.data;
};

export default { getAll, create, remove, update };
