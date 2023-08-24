import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const formEl = document.querySelector('.search-form');

async function getImages(page) {
  const params = new URLSearchParams({
    key: '38990846-6ef50e95cf88c84afac172328',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });

  params.set('q', formEl.elements.searchQuery.value);

  const response = await axios.get(`${BASE_URL}?${params}`);
  if (response.status !== 200) {
    throw new Error(err);
  }

  return response;
}

export { getImages };
