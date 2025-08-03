import axios from "axios";
import loginService from "./login";
import type { Category, DeleteResponse } from "../types/types";
import type {
  PictureAllDataResponse,
  PicturesByCategoryResponse,
  AddPictureResponse,
  UpdatePicture,
  UpdatePictureResponse,
  PicturesAddViewResponse,
  PictureOrder,
} from "../types/pictureTypes";

const baseUrl = "/api/pictures/";

const getAllData = async (
  category: Category
): Promise<PictureAllDataResponse> => {
  const urlExtension =
    category != undefined ? `/allData/?search=${category}` : "/allData/";
  const response = await axios.get<PictureAllDataResponse>(
    baseUrl + urlExtension
  );

  return response.data;
};

const getPicturesByCategory = async (
  category: Category
): Promise<PicturesByCategoryResponse> => {
  const url = category ? `${baseUrl}?search=${category}` : baseUrl;
  const response = await axios.get<PicturesByCategoryResponse>(url);

  return response.data;
};

const getCategoryLatest = async (
  category: Category
): Promise<PicturesByCategoryResponse> => {
  const url = category ? `${baseUrl}latest/?search=${category}` : baseUrl;
  const response = await axios.get<PicturesByCategoryResponse>(url);

  return response.data;
};

const create = async (newObject: FormData): Promise<AddPictureResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post<AddPictureResponse>(
    `${baseUrl}upload`,
    newObject,
    config
  );
  return response.data;
};

const update = async (
  content: UpdatePicture
): Promise<UpdatePictureResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    type: content.formData.type,
    textFi: content.formData.textFi,
    textEn: content.formData.textEn,
    keywords: content.formData.keywords,
    month: content.formData.month,
    year: content.formData.year,
  };

  const response = await axios.put<UpdatePictureResponse>(
    `${baseUrl}${content.pictureId}`,
    newObject,
    config
  );

  return response.data;
};

const moveUp = async (pictureId: number): Promise<PictureOrder> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put<PictureOrder>(
    `${baseUrl}orderUp/${pictureId}`,
    {},
    config
  );
  return response.data;
};

const moveDown = async (pictureId: number): Promise<PictureOrder> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put<PictureOrder>(
    `${baseUrl}orderDown/${pictureId}`,
    {},
    config
  );
  return response.data;
};

const addView = async (pictureId: number): Promise<PicturesAddViewResponse> => {
  const response = await axios.put<PicturesAddViewResponse>(
    `${baseUrl}addView/${pictureId}`
  );
  return response.data;
};

const remove = async (pictureId: number): Promise<DeleteResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete<DeleteResponse>(
    `${baseUrl}${pictureId}`,
    config
  );
  return response.data;
};

export default {
  getAllData,
  create,
  update,
  remove,
  getPicturesByCategory,
  getCategoryLatest,
  addView,
  moveUp,
  moveDown,
};
