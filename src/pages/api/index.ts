// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { AxiosResponse } from "axios";
import { User } from "../interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ILogin {
  user?: User;
  accessToken?: string;
}

interface ISetAvatar {
  image: string;
  isSet: boolean;
}
interface PeerId {
  peerId: string;
}

export const host = `${API_URL}`;
// export const host = `http://localhost:4000`;

const API = axios.create({
  baseURL: host,
});

export const signUp = (FormData: {
  password: string;
  username: string;
  email: string;
}) => API.post("auth/signup", FormData);

export const login = (FormData: {
  email: string;
  password: string;
}): Promise<AxiosResponse<ILogin>> => API.post("auth/login", FormData);

export const getAllUsers = (
  currentUserId: string,
  accessToken: string
): Promise<AxiosResponse<User[]>> =>
  API.get(`/users/${currentUserId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getPeerId = (
  currentChatId: number,
  accessToken: string
): Promise<AxiosResponse<PeerId>> =>
  API.get(`/users?currentChatId=${currentChatId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
