import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
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
  if (response.data.total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        position: 'center-top',
        fontSize: '16px',
        width: '400px',
      }
    );
  }
  return response;
}

export { getImages };
