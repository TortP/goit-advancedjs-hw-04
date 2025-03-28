import './css/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/pixabay-api';
import { createGalleryMarkup } from './js/render-functions';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let lightbox = new SimpleLightbox('.gallery li');

let currentPage = 1;
const perPage = 15;
let currentQuery = '';
let shownImageIds = new Set();
let totalImages = 0;
const errorCatch = () =>
  showToast(
    'error',
    'Something went wrong. Please try again later!',
    '#ff4d4d',
    'fa fa-times-circle'
  );
const loadComplete = () =>
  showToast(
    'info',
    "We're sorry, but you've reached the end of search results.",
    '#106BDA',
    'fas fa-info-circle'
  );

function showToast(type, message, backgroundColor, icon) {
  const options = {
    message,
    position: 'topRight',
    timeout: 3000,
    backgroundColor,
    titleColor: '#fff',
    messageColor: '#fff',
    icon,
    iconColor: '#fff',
    progressBarColor: '#fff',
    close: true,
    closeOnClick: true,
  };
  iziToast[type](options);
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  currentQuery = form.elements.searchQuery.value.trim();
  form.reset();
  if (!currentQuery) {
    showToast(
      'warning',
      'Enter a keyword to search!',
      '#ffc107',
      'fa fa-exclamation-circle'
    );
    return;
  }

  currentPage = 1;
  gallery.innerHTML = '';
  shownImageIds.clear();
  loadMoreBtn.classList.add('is-hidden');
  loader.classList.add('is-hidden');

  loader.classList.remove('is-hidden');

  try {
    const { hits, totalHits } = await fetchImages(
      currentQuery,
      currentPage,
      perPage
    );
    totalImages = totalHits;

    const newImages = hits.filter(img => !shownImageIds.has(img.id));
    newImages.forEach(img => shownImageIds.add(img.id));

    if (newImages.length === 0) {
      showToast(
        'error',
        'Sorry, there are no images matching your search query. Please, try again!',
        '#ff4d4d',
        'fa fa-times-circle'
      );
    } else {
      const markup = createGalleryMarkup(newImages);
      gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();

      if (shownImageIds.size < totalImages) {
        loadMoreBtn.classList.remove('is-hidden');
      } else {
        loadComplete();
      }
    }
  } catch (error) {
    errorCatch();
  } finally {
    loader.classList.add('is-hidden');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  loader.classList.remove('is-hidden');
  loadMoreBtn.classList.add('is-hidden');

  let newImages = [];
  let tempPage = currentPage + 1;

  try {
    while (newImages.length < perPage) {
      const { hits } = await fetchImages(currentQuery, tempPage, perPage);
      const uniqueHits = hits.filter(img => !shownImageIds.has(img.id));

      if (uniqueHits.length === 0) {
        break;
      }

      uniqueHits.forEach(img => shownImageIds.add(img.id));
      newImages.push(...uniqueHits);
      tempPage += 1;

      if (shownImageIds.size >= totalImages) {
        break;
      }
    }

    currentPage = tempPage - 1;

    if (newImages.length > 0) {
      const markup = createGalleryMarkup(newImages.slice(0, perPage));
      gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();

      const card = document.querySelector('.gallery li');
      if (card) {
        const cardHeight = card.getBoundingClientRect().height;
        window.scrollBy({
          top: cardHeight * 3 + 20,
          behavior: 'smooth',
        });
      }
    }

    if (shownImageIds.size >= totalImages || newImages.length < perPage) {
      loadMoreBtn.classList.add('is-hidden');
      loader.classList.add('is-hidden');
      loadComplete();
    } else {
      loadMoreBtn.classList.remove('is-hidden');
      loader.classList.add('is-hidden');
    }
  } catch (error) {
    errorCatch();
  } finally {
    loader.classList.add('is-hidden');
  }
});
