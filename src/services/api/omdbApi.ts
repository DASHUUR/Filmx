import axios from 'axios';

const omdbClient = axios.create({
  baseURL: 'https://www.omdbapi.com/',
});

export const getOMDBMovie = async (title: string) => {
  const response = await omdbClient.get('', {
    params: {
      apikey: process.env.EXPO_PUBLIC_OMDB_KEY,
      t: title,
    },
  });

  return response.data;
};