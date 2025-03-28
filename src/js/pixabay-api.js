import axios from 'axios';

const API_KEY = '20370935-71350e4ff636eebefea7dcc17';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page = 1, perPage = 9) => {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });

  return {
    hits: response.data.hits,
    totalHits: response.data.totalHits,
  };
};
