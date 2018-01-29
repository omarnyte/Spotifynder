import Spotify from 'spotify-web-api-js';

import Search from './search';

const aboutButton = document.querySelector('.about-button');
const aboutModal = document.querySelector('.about-modal');
const closeModalButton = document.querySelector('.close-modal-button');
const muteButton = document.querySelector('.mute-button');
const returnButton = document.querySelector('.return-button');

let token;

window.muted = false;

const spotify = new Spotify();

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    console.log('token', token);
    spotify.setAccessToken(token);
  }
  // TODO on error, attempt to get new token
});

function toggleMute(e) {
  if (muted == false) {
    muted = true;
    e.target.innerText = 'SOUND OFF';
  } else {
    muted = false;
    e.target.innerText = 'SOUND ON';
  }
}

aboutButton.addEventListener('click', () => {
  aboutModal.classList.remove('hidden');
});
closeModalButton.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
});
muteButton.addEventListener('click', toggleMute);
returnButton.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
});
