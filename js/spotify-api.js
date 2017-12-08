// API code provided by https://github.com/sperrow/js-project
import Spotify from 'spotify-web-api-js';
const s = new Spotify();

// import Search from './search';
import relatedArtists from './related_artists';
import bubbleChart from './bubble_chart';

let token;

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    console.log(token);
    s.setAccessToken(token);
  }
  // TODO on error, attempt to get new token
});

document.addEventListener("DOMContentLoaded", function(event) {
  const searchForm = document.querySelector(".search-form");

  searchForm.addEventListener("submit", e => {
    e.preventDefault();

    const searchQuery = document.querySelector(".search-bar");
    console.log(searchQuery.value);
    const artistID = searchQuery.value;
    searchQuery.value = "";
    // s.searchArtists(searchQuery.value)
    //   .then(resp => console.log(resp));

    s.getArtistRelatedArtists(artistID)
      .then(resp => {
        console.log(resp);
        // new bubbleChart();
        new relatedArtists(resp);
    });
  });
});
