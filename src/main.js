import { fetchPhotos } from './js/pixabay-api.js';
import { createGalleryCard } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let currentPage = 1;
const perPage = 40;
let lightbox;


function showLoader() {
  document.querySelector('.loader').style.display = 'block';
}

function hideLoader() {
  document.querySelector('.loader').style.display = 'none';
}


searchForm.addEventListener('submit', onSearch);


async function onSearch(event) {
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

  try {
    const data = await fetchPhotos(currentQuery, currentPage, perPage);

    if (data.hits.length === 0) {
      showErrorToast();
      return;
    }

    renderGallery(data.hits);
    lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
}

function renderGallery(images) {
  const markup = images.map(createGalleryCard).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
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
