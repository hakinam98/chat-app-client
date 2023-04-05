// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosResponse } from "axios";
import { User } from "../interfaces";

const API_URL = process.env.API_URL;

interface ILogin {
  status?: boolean;
  user?: User;
  msg?: string;
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
}) => API.post("/users", FormData);

export const login = (FormData: {
  email: string;
  password: string;
}): Promise<AxiosResponse<ISetAvatar>> => API.post("/auth/login", FormData);
