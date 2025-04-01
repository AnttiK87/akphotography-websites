import axios from "axios";
import picturesService from "../services/pictures";

const baseUrl = "/api/keywords";

const getAll = async () => {
  //console.log("called get all keywords");
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = async (content) => {
  console.log("you are in services with content: ", JSON.stringify(content));
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
  //console.log(`content ${JSON.stringify(content.keywordId)}`);
  const response = await axios.delete(
    `${baseUrl}/${content.keywordId}`,
    config
  );

  return response.data;
};

export default { getAll, remove, update };
