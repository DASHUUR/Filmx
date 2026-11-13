import axios from 'axios';

const client = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const getUserProfile = async (id: number) => {
  const response = await client.get(`/users/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await client.get('/users');
  return response.data.users;
};