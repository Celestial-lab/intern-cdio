import axios from 'axios';

const BaseUrl = 'https://f0eb-171-238-157-243.ngrok-free.app/'
const instance = axios.create({
    baseURL: BaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://f0eb-171-238-157-243.ngrok-free.app/',
      'ngrok-skip-browser-warning': 'true',
    },
});

export const instanceFormData = axios.create({
  baseURL: BaseUrl,
  headers: {
    // 'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': 'https://f0eb-171-238-157-243.ngrok-free.app/',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default instance;