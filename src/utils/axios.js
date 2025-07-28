import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://materialmart.shop/materialmartapi/dashboard', // or your deployed URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;

 