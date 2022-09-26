const API_KEY = '30134858-13f32c0567951619113554426';
const BASE_URL = 'https://pixabay.com/api/';

export default class FetchSearch {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  fetchApi() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(({ hits, totalHits }) => {
        this.totalHits = totalHits;
        this.getMorePages();

        return hits;
      })
      .catch(error => console.log(error));
  }

  getMorePages() {
    this.page += 1;
  }

  resetPages() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
