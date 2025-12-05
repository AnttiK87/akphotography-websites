import axios from "axios";
import loginService from "./login";

import type {
  ResponseHomeScreenPictures,
  ChangePicResponse,
} from "../types/uiComponentTypes";

const baseUrl = "/api/uiComponents";

const getHomeBackGround = async (): Promise<ResponseHomeScreenPictures> => {
  const response = await axios.get(`${baseUrl}/homeBackground`);
  return response.data;
};

const changePic = async (newObject: FormData): Promise<ChangePicResponse> => {
  const token = loginService.getToken();

  const config = {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  };

  const response = await axios.put<ChangePicResponse>(
    `${baseUrl}/changePic`,
    newObject,
    config
  );
  return response.data;
};

const deletePic = async (data: {
  path: string;
  filename: string;
}): Promise<ChangePicResponse> => {
  const token = loginService.getToken();

  const response = await axios.put(`${baseUrl}/deletePic`, data, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export default { getHomeBackGround, changePic, deletePic };
