// API code provided by https://github.com/sperrow/js-project
import Spotify from 'spotify-web-api-js';
const s = new Spotify();

import Search from './search';

let token;

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    s.setAccessToken(token);
  }
  // TODO on error, attempt to get new token 
});

document.addEventListener("DOMContentLoaded", function(event) {
  Search();
  console.log(token);
});
//


// document.getElementById('search-button').addEventListener('click', (e) => {
//   s.getAlbum('6zfkiTCfpCeQCokEMlpudS')
//     .then(data => {
//       let url = data.tracks.items[0].preview_url;
//       const container = document.getElementById('results');
//       let audio = document.createElement('audio');
//       audio.setAttribute('src', url);
//       audio.setAttribute('controls', 'controls');
//       container.appendChild(audio);
//     });
// });
