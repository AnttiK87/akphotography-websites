import type { LoginResponse } from "./loginTypes";

export interface UserState {
  username: string | undefined;
  token: string | undefined;
  name: string | undefined;
  email: string | undefined;
  firstLogin: boolean;
  lastLogin: string | undefined;
  password: string | undefined;
  loginUser: LoginResponse | undefined;
  user: User | undefined;
  profilePicture: string | undefined;
}

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
  loginTime: string;
  profilePicture: string;
};

export type FirstLogin = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type ChangePassword = {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
};

export type UpdateInfo = {
  name: string;
  username: string;
  email: string;
};

export type UpdateUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
};

export type UserUpdateResponse = {
  messageFi: string;
  messageEn: string;
  user: UpdateUser;
};

export type changeProfPicResponse = {
  newProfPic: string;
};
