import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL을 설정해주세요.');
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
