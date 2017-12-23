import Spotify from 'spotify-web-api-js';

import Search from './search';
import RelatedArtistsChart from './related_artists';
import BubbleChart from './bubble_chart';

const spotify = new Spotify();

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

// const searchForm = document.querySelector(".search-form");
//
// searchForm.addEventListener("submit", e => {
//   e.preventDefault();
//
//   const welcome = document.querySelector(".welcome");
//   welcome.classList.add("hidden");
//
//   const charts = document.querySelector(".charts");
//   charts.classList.remove("hidden");
//
//   // spotify search query
//   const searchQuery = document.querySelector('.search-bar').value;
//   spotify.searchArtists(searchQuery)
//     .then(artistsResp => {
//       console.log(artistsResp);
//       const artistId = artistsResp.artists.items[0].id;
//       spotify.getArtistRelatedArtists(artistId)
//         .then(relatedArtistsResp => {
//           new BubbleChart(relatedArtistsResp);
//
//           const topArtistResult = artistsResp.artists.items[0];
//           new RelatedArtistsChart(topArtistResult, relatedArtistsResp);
//         });
//     });
// });
