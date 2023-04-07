// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { AxiosResponse } from "axios";
import { User } from "../interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(API_URL);

interface ILogin {
  user?: User;
  accessToken?: string;
}

interface ISetAvatar {
  image: string;
  isSet: boolean;
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
