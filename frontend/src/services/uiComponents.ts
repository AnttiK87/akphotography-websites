import axios from "axios";

import type { ReplyHomeScreenPictures } from "../types/uiComponentTypes";

const baseUrl = "/api/uiComponents";

const getHomeBackGround = async (): Promise<ReplyHomeScreenPictures> => {
  const response = await axios.get(`${baseUrl}/homeBackground`);
  return response.data;
};

export default { getHomeBackGround };
