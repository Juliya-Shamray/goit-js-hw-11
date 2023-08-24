import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

async function getImages(page, query) {
  const params = new URLSearchParams({
    key: '38990846-6ef50e95cf88c84afac172328',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    q: query,
    per_page: 40,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);

  return response;
}

export { getImages };
