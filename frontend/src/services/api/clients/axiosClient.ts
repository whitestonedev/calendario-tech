import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // URL do seu backend ou serviço
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
