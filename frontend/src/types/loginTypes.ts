export type Credentials = {
  username: string;
  password: string;
};

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  name: string;
  email: string;
  lastLogin: string;
  firstLogin: boolean;
  profilePicture: string;
}

export interface LogoutResponse {
  message: string;
}
