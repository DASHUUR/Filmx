import axios from 'axios';

const tvmazeClient = axios.create({
  baseURL: 'https://api.tvmaze.com',
});

export const getPopularShows = async () => {
  const response = await tvmazeClient.get('/shows');

  return response.data;
};

export const searchShows = async (query: string) => {
  const response = await tvmazeClient.get('/search/shows', {
    params: { q: query },
  });

  return response.data;
};