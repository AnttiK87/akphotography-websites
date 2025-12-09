import axios from "axios";
import loginService from "./login";

import type {
  ResponseHomeScreenPictures,
  ChangePicResponse,
} from "../types/uiComponentTypes";
import type {
  UiText,
  UiTextResponse,
  UpdateUiText,
} from "../types/uiTextTypes";

const baseUrl = "/api/uiComponents";

const getPictures = async (path: string) => {
  const res = await axios.get<ResponseHomeScreenPictures>(
    `${baseUrl}/getPictures`,
    { params: { path } }
  );

  return res.data;
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

const getUiTexts = async () => {
  const res = await axios.get<UiText[]>(`${baseUrl}/uiTexts`);

  return res.data;
};

const newUiText = async (newObject: UiText): Promise<UiTextResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post<UiTextResponse>(
    `${baseUrl}`,
    newObject,
    config
  );
  return response.data;
};

const updateUiText = async (content: UpdateUiText): Promise<UiTextResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    content: content.content,
  };

  const response = await axios.put<UiTextResponse>(
    `${baseUrl}/updateUiText/${content.id}`,
    newObject,
    config
  );
  return response.data;
};

export default {
  getPictures,
  changePic,
  deletePic,
  getUiTexts,
  newUiText,
  updateUiText,
};
