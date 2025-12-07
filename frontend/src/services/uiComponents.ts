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

import type { AxiosProgressEvent } from "axios";

const changePic = async (
  newObject: FormData,
  onProgress?: (progress: number, ms: number) => void
): Promise<ChangePicResponse> => {
  const token = loginService.getToken();
  const start = performance.now();

  const config = {
    headers: {
      Authorization: token,
    },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (!event.total) return;

      const percent = Math.round((event.loaded! / event.total) * 100);
      const ms = performance.now() - start;

      onProgress?.(percent, ms);
    },
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
