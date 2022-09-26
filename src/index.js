import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FetchSearch from './js/fetchSearch';
import LoadMoreBtn from './js/loadMoreBtn';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  gallaryContainer: document.querySelector('.js-gallery'),
};
const fetchSearch = new FetchSearch();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();
  fetchSearch.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!fetchSearch.query) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    fetchSearch.fetchApi().then(images => {
      if (fetchSearch.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${fetchSearch.totalHits} images`);
        loadMoreBtn.show();
        fetchSearch.resetPages();
        clearRender();
        fetchImages();
      }
    });
  }
}

function fetchImages() {
  loadMoreBtn.disabled();
  fetchSearch.fetchApi().then(images => {
    renderImages(images);
    loadMoreBtn.enable();
  });
}

function renderImages(images) {
  const murkup = images
    .map(image => {
      return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${image.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');

  refs.gallaryContainer.insertAdjacentHTML('beforeend', murkup);
}

function clearRender() {
  refs.gallaryContainer.innerHTML = '';
}
