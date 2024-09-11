import axios from 'axios';

const BaseUrl = 'https://2a61-116-110-54-110.ngrok-free.app'
const instance = axios.create({
    baseURL: BaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://2a61-116-110-54-110.ngrok-free.app',
      'ngrok-skip-browser-warning': 'true',
    },
});

export default instance;