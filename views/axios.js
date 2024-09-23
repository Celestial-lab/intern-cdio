import axios from 'axios';

const BaseUrl = 'https://0c42-116-105-31-43.ngrok-free.app'
const instance = axios.create({
    baseURL: BaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://0c42-116-105-31-43.ngrok-free.app',
      'ngrok-skip-browser-warning': 'true',
    },
});

export default instance;