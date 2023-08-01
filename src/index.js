import axios from "axios";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '35528535-2026f3bafef7be5a50534f79c';
const BASE_URL = 'https://pixabay.com/api/';
let enterValue = '';

const imageBox = document.querySelector('.gallery');
const pageform = document.querySelector('.search-form');
const pageInput = document.querySelector('input');

pageInput.addEventListener('input', (event) => {
  enterValue = event.target.value;
});

async function getImageCollection() {
  return await axios.get(`${BASE_URL}?key=${API_KEY}&q=${enterValue}&image_type=photo`);
}

function renderImageCollection() {
  getImageCollection().then(response => {
    const data = response.data;
    data.hits.map(card => {
      const url = card.webformatURL;
      const image = `<div class="photo-card">
        <img width="350" height="233" src="${url}" alt="${card.tags}" loading="lazy" />
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
    });
  });
}


pageform.addEventListener('submit', (event) => {
  if (!enterValue) {
    alert('А що саме ви хочете побачити?')
  //  Report.failure('А що саме ви хочете побачити?');
    return
  } 

    event.preventDefault(); 
    imageBox.innerHTML = ''; 
    renderImageCollection(); 
  
});
