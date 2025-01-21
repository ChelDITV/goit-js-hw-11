import { fetchPhotos } from './js/pixabay-api.js';
import { createGalleryCard } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

let currentQuery = '';
let currentPage = 1;
const perPage = 40;
let lightbox;

searchForm.addEventListener('submit', onSearch);

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showErrorToast() {
  iziToast.error({
    title: '',
    message: 'Sorry, there are no images matching<br>your search query. Please, try again!',
    position: 'topRight',
    timeout: 5000,
    backgroundColor: '#f14646',
    class: 'custom-toast',
  });
}

function onSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  showLoader();

  fetchPhotos(currentQuery, currentPage, perPage)
    .then((data) => {
      setTimeout(() => {
        hideLoader();

        if (data.hits.length === 0) {
          showErrorToast();
          return;
        }

        renderGallery(data.hits);
        lightbox = new SimpleLightbox('.gallery a');
        lightbox.refresh();
      }, 2000); 
    })
    .catch(() => {
      hideLoader();
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
        timeout: 3000,
      });
    });
}

function renderGallery(images) {
  const markup = images.map(createGalleryCard).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}
