import axios, { AxiosInstance } from 'axios';
import { BACKEND_URL } from '~/config';

const http: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

export const getStart = async (): Promise<any> => {
  const { data: result } = await http.get(`/start`);
  return Object.freeze(result);
};

export const postStart = async (wallet: string): Promise<any> => {
  const { data: result } = await http.post(`/start`, {
    wallet,
  });
  return Object.freeze(result);
};

export const getCollection = async (hash: string): Promise<any> => {
  const { data: result } = await http.get(`/collection/${hash}`);
  return Object.freeze(result);
};

export const getUserCollections = async (): Promise<any> => {
  const { data: result } = await http.get(`/collection/user`);
  return Object.freeze(result);
};

export const createNewCollection = async (params: any): Promise<any> => {
  try {
    const { data: result } = await http.postForm(`/collection/create`, params);
    console.log(result);
    return Object.freeze(result);
  } catch (e) {
    console.error(e);
    return Object.freeze({ ok: false });
  }
};
