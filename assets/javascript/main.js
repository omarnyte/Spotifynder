import Spotify from 'spotify-web-api-js';

import RelatedArtistsChart from './related_artists';

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

const searchForm = document.querySelector(".search-form");

searchForm.addEventListener("submit", e => {
  e.preventDefault();

  const welcome = document.querySelector(".welcome");
  welcome.classList.add("hidden");

  const charts = document.querySelector(".charts");
  charts.classList.remove("hidden");

  // spotify search query
  const searchQuery = document.querySelector('.search-bar').value;
  spotify.searchArtists(searchQuery)
    .then(artistsResp => {
      console.log('artistsResp', artistsResp);
      const artistId = artistsResp.artists.items[0].id;
      spotify.getArtistRelatedArtists(artistId)
        .then(relatedArtistsResp => {
          const topArtistResult = artistsResp.artists.items[0];
          new RelatedArtistsChart(topArtistResult, relatedArtistsResp);
        });
    });
});
