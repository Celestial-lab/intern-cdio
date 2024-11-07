import axios from 'axios';


const BaseUrl = 'https://9d98-116-103-20-161.ngrok-free.app'
const instance = axios.create({
    baseURL: BaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://9d98-116-103-20-161.ngrok-free.app',
      'ngrok-skip-browser-warning': 'true',
    },
});

export const instanceFormData = axios.create({
  baseURL: BaseUrl,
  headers: {
    // 'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': 'https://9d98-116-103-20-161.ngrok-free.app',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default instance;