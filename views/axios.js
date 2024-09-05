import axios from 'axios';
const BaseUrl = 'https://3f0c-116-110-54-110.ngrok-free.app/'
const instance = axios.create({
    baseURL: BaseUrl,
    withCredentials: true
});
console.log('Axios baseURL:',);
export default instance;