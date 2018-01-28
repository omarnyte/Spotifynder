import Spotify from 'spotify-web-api-js';

import Navbar from './navbar';
import Search from './search';
import RelatedArtistsChart from './related_artists';
import BubbleChart from './bubble_chart';

const spotify = new Spotify();
const aboutButton = document.querySelector('.about-button');
const aboutModal = document.querySelector('.about-modal');
const closeModalButton = document.querySelector('.close-modal-button');
const returnButton = document.querySelector('.return-button');

let token;

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    console.log('token', token);
    spotify.setAccessToken(token);
  }
  // TODO on error, attempt to get new token
});

aboutButton.addEventListener('click', () => {
  aboutModal.classList.remove('hidden');
});
closeModalButton.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
});
returnButton.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
});
