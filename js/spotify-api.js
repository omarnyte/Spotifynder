const Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();

let token;

$.ajax({
  url: '/token',
  success: function(response) {
    token = response;
    spotifyApi.setAccessToken(token);
  }
});

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
