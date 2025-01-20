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
let isLoading = false;

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', onScroll);

// Функція для показу сповіщень про помилку
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
  }
}

async function onScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    isLoading = true;
    currentPage += 1;

    try {
      const data = await fetchPhotos(currentQuery, currentPage, perPage);

      if (data.hits.length > 0) {
        renderGallery(data.hits);
        lightbox.refresh();
      } else {
        iziToast.info({
          title: 'Info',
          message: 'No more images to load.',
          position: 'topRight',
          timeout: 3000,
        });
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
        timeout: 3000,
      });
    } finally {
      isLoading = false;
    }
  }
}

function renderGallery(images) {
  const markup = images.map(createGalleryCard).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}
