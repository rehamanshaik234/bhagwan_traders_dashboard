import axios from 'axios';

export const BASE_URL = 'http://localhost:3000/materialmartapi/';

const instance = axios.create({
  baseURL: 'http://localhost:3000/materialmartapi/', // or your deployed URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFiaSIsImVtYWlsIjoiYWJpQGV4YW1wbGUuY29tIiwiaWF0IjoxNzUwOTU4Nzg5LCJleHAiOjE3NTExMzE1ODl9.eX2KoD6DbAma-nTB0Pg57Kzf9mGdUlNE8SjcePdqduU"}`;
  return config;
});

export default instance;

 