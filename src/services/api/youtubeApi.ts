import axios from 'axios';

export const getMovieTrailer = async (movieId: number) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/videos`,
    {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );

  return response.data.results.find(
    (video: any) =>
      video.site === 'YouTube' &&
      video.type === 'Trailer' &&
      video.official
  ) || response.data.results.find(
    (video: any) =>
      video.site === 'YouTube' &&
      video.type === 'Trailer'
  );
};