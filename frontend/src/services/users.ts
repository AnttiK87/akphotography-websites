import axios from "axios";
import loginService from "./login";
import type {
  User,
  FirstLogin,
  ChangePassword,
  UpdateInfo,
  UserUpdateResponse,
  changeProfPicResponse,
} from "../types/userTypes";
import type { AxiosProgressEvent } from "axios";

const baseUrl = "/api/users";

const getAll = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(baseUrl);
  return response.data;
};

const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get<User>(`${baseUrl}/${id}`);
  return response.data;
};

const updateFirstLogin = async (
  content: FirstLogin
): Promise<UserUpdateResponse> => {
  const token = loginService.getToken();
  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    name: content.name,
    username: content.username,
    email: content.email,
    password: content.password,
    passwordConfirmation: content.passwordConfirmation,
  };

  const response = await axios.put<UserUpdateResponse>(
    `${baseUrl}/updateFirstLogin`,
    newObject,
    config
  );
  return response.data;
};

const changePassword = async (
  content: ChangePassword
): Promise<UserUpdateResponse> => {
  const token = loginService.getToken();

  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    oldPassword: content.oldPassword,
    newPassword1: content.newPassword1,
    newPassword2: content.newPassword2,
  };

  const response = await axios.put<UserUpdateResponse>(
    `${baseUrl}/changePassword`,
    newObject,
    config
  );
  return response.data;
};

const updateInfo = async (content: UpdateInfo): Promise<UserUpdateResponse> => {
  const token = loginService.getToken();

  const config = {
    headers: { Authorization: token },
  };

  const newObject = {
    name: content.name,
    username: content.username,
    email: content.email,
  };

  const response = await axios.put<UserUpdateResponse>(
    `${baseUrl}/updateInfo`,
    newObject,
    config
  );
  return response.data;
};

const changeProfPic = async (
  newObject: FormData,
  onProgress?: (progress: number, ms: number) => void
): Promise<changeProfPicResponse> => {
  const token = loginService.getToken();
  const start = performance.now();

  const config = {
    headers: { Authorization: token },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (!event.total) return;

      const percent = Math.round((event.loaded! / event.total) * 100);
      const ms = performance.now() - start;

      onProgress?.(percent, ms);
    },
  };

  const response = await axios.put<changeProfPicResponse>(
    `${baseUrl}/changeProfPic`,
    newObject,
    config
  );
  return response.data;
};

export default {
  getAll,
  getUserById,
  updateFirstLogin,
  changePassword,
  updateInfo,
  changeProfPic,
};
