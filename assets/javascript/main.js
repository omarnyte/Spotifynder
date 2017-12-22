import Spotify from 'spotify-web-api-js';
const spotify = new Spotify();

let token;

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    console.log(token);
    spotify.setAccessToken(token);
  }
  // TODO on error, attempt to get new token
});

const searchForm = document.querySelector(".search-form");

searchForm.addEventListener("submit", e => {
  e.preventDefault();

  const welcome = document.querySelector(".welcome");
  welcome.classList.add("hidden");

  const charts = document.querySelector(".charts");
  charts.classList.remove("hidden");
});

// document.addEventListener("DOMContentLoaded", function(event) {
//   const searchForm = document.querySelector(".search-form");
//
//   searchForm.addEventListener("submit", e => {
//     e.preventDefault();
//
//     const searchQuery = document.querySelector(".search-bar");
//     console.log(searchQuery.value);
//     const artistID = searchQuery.value;
//     searchQuery.value = "";
//     // s.searchArtists(searchQuery.value)
//     //   .then(resp => console.log(resp));
//
//     s.getArtistRelatedArtists('00FQb4jTyendYWaN8pK0wa') //TODO change back to name
//       .then(resp => {
//         console.log(resp);
//         // new bubbleChart();
//         new relatedArtists(resp);
//     });
//   });
// });
