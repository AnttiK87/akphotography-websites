import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/keywords";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = async (content) => {
  const token = picturesService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    keyword: content.formData.keyword,
  };

  const response = await axios.put(
    `${baseUrl}/update/${content.keywordId}`,
    newObject,
    config
  );
  return response.data;
};

const remove = async (content) => {
  const token = picturesService.getToken();
  const config = {
    headers: { Authorization: token },
    data: content,
  };
  const response = await axios.delete(
    `${baseUrl}/${content.keywordId}`,
    config
  );

  return response.data;
};

export default { getAll, remove, update };
