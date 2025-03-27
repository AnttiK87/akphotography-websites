import axios from "axios";

const baseUrl = "/api/keywords";

const getAll = async () => {
  //console.log("called get all keywords");
  const response = await axios.get(baseUrl);
  return response.data;
};

const remove = async (content) => {
  //console.log(`content ${JSON.stringify(content.keywordId)}`);
  const response = await axios.delete(`${baseUrl}/${content.keywordId}`, {
    data: content,
  });

  return response.data;
};

export default { getAll, remove };
