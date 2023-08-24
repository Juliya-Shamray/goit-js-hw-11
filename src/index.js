import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImages } from './helpers';

let page = 0;
let per_page = 40;
let maxPage = 1;
let lightbox;

const formEl = document.querySelector('.search-form');
const divEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const errorRequest = 'Oops, something went wrong';
const errorNoImages =
  'Sorry, there are no images matching your search query. Please try again.';

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);
formEl.addEventListener('input', onInputEnter);

loadMoreBtn.classList.add('is-hidden');
formEl.lastElementChild.disabled = true;

function onInputEnter(event) {
  const input = event.target.value.trim();
  formEl.lastElementChild.disabled = true;
  if (input.trim() !== '') {
    formEl.lastElementChild.disabled = false;
  }
}

function onFormSubmit(event) {
  page = 1;
  event.preventDefault();
  lightbox = new SimpleLightbox('.gallery a');
  loadMoreBtn.classList.add('is-hidden');

  getImages(page)
    .then(response => {
      maxPage = Math.ceil(response.data.totalHits / per_page);
      renderImageGallery(response.data.hits);
      if (response.data.total === 0) {
        Notify.failure(errorNoImages, {
          position: 'center-top',
          fontSize: '16px',
          width: '400px',
        });
      }
      if (response.data.totalHits > 0) {
        Notify.info(`Hooray! We found ${response.data.totalHits} images.`, {
          timeout: 3000,
        });
        if (response.data.totalHits < 40) {
          loadMoreBtn.classList.add('is-hidden');
        } else {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => Notify.failure(errorRequest));

  divEl.innerHTML = '';
  lightbox.refresh();
}

function renderImageGallery(arr) {
  const gallery = arr
    .map(
      ({
        likes,
        views,
        comments,
        downloads,
        tags,
        webformatURL,
        largeImageURL,
      }) =>
        `<div class="photo-card">
        <a href=${largeImageURL}>
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
        </a>
        <div class="info">
          <p class="info-item">
            <b> Likes </b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views </b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments </b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads </b>
            ${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
  divEl.insertAdjacentHTML('beforeend', gallery);
  lightbox.refresh();
}

function onClickLoadMoreBtn() {
  page += 1;
  if (page === maxPage) {
    loadMoreBtn.classList.add('is-hidden');

    Notify.info(errorNoImages, {
      position: 'center-top',
      width: '400px',
      fontSize: '16px',
      timeout: 2000,
    });
  }

  getImages(page)
    .then(response => {
      renderImageGallery(response.data.hits);
      const { height: cardHeight } =
        divEl.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2.4,
        behavior: 'smooth',
      });
    })
    .catch(error => Notify.failure(errorRequest));
}
