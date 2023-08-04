import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '35528535-2026f3bafef7be5a50534f79c';
const BASE_URL = 'https://pixabay.com/api/';
let enterValue = '';
let pageNumber = 1;
let lightbox;
const imageBox = document.querySelector('.gallery');
const pageform = document.querySelector('.search-form');
const pageInput = document.querySelector('input');
const btnShowMore = document.querySelector('.show-more');


btnShowMore.addEventListener('click', renderNextPage);
imageBox.addEventListener('click', openImage);
pageInput.addEventListener('input', (event) => {
  enterValue = (event.target.value).trim();
});

async function getImageCollection() {
  return await axios.get(`${BASE_URL}?key=${API_KEY}&q=${enterValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`);
}

function renderImageCollection() {
  getImageCollection().then(response => {
    const data = response.data;
    
    if (data.total === 0 || !enterValue) {
      btnShowMore.classList.add('is-hidden')
      Notify.warning('По вашому запиту нічого не знайдено!',
        {
          timeout: 3000,
          position: "center-center",
          width: '400px',
          fontSize: '18px'
        });
      pageInput.value = '';
      return
    }

    Notify.success(`Знайдено ${data.totalHits} зображень`,
        {
          timeout: 5000,
          position: "center-center",
          width: '400px',
          fontSize: '18px'
        });
    if (data.hits.length === 40) btnShowMore.classList.remove('is-hidden');

    data.hits.map(card => {
      const url = card.webformatURL;
      const image = `<div class="photo-card">
      <a href="${card.largeImageURL}">
      <img width="350" height="233" src="${url}" alt="${card.tags}" loading="lazy" />
      </a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b>  ${card.likes}
          </p>
          <p class="info-item">
            <b>Views:</b>  ${card.views}
          </p>
          <p class="info-item">
            <b>Comments:</b>  ${card.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b>  ${card.downloads}
          </p>
        </div>
      </div>`;
      imageBox.insertAdjacentHTML('beforeend', image);
      pageInput.value = '';
    });

    if (!lightbox) {
      lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'Alt',
        captionDelay: '250'

      });

    }
  });
}

pageform.addEventListener('submit', (event) => {
  
    event.preventDefault(); 
    imageBox.innerHTML = ''; 
    renderImageCollection(); 
  
});

function renderNextPage() {
  pageNumber += 1;
  
  getImageCollection().then(response => {
    const data = response.data;
    const pageQuantity = Math.ceil(data.totalHits / 40);
    if (data.hits.length < 40 || pageNumber === pageQuantity) btnShowMore.classList.add('is-hidden');
    

    Notify.success(`Сторінка:${pageNumber}, всьго:${pageQuantity}`,
        {
          timeout: 5000,
          position: "center-center",
          width: '400px',
          fontSize: '18px'
        });

    data.hits.map(card => {
      const url = card.webformatURL;

      const image = `<div class="photo-card">
        <a href="${card.largeImageURL}">
          <img width="350" height="233" src="${url}" alt="${card.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b>  ${card.likes}
          </p>
          <p class="info-item">
            <b>Views:</b>  ${card.views}
          </p>
          <p class="info-item">
            <b>Comments:</b>  ${card.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b>  ${card.downloads}
          </p>
        </div>
      </div>`;
      imageBox.insertAdjacentHTML('beforeend', image);
      
      pageInput.value = '';
    });
    lightbox.refresh();
  });
}

function openImage(event) {
  event.preventDefault();
  if(event.target.tagName !== 'IMG') return;
  imageBox.removeEventListener('click', openImage);
}