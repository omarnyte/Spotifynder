import Spotify from 'spotify-web-api-js';

const spotify = new Spotify();

// prevent submission of form
const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", e => {
  e.preventDefault();
});

const searchBar = document.querySelector('.search-bar');

function fetchMatches(e) {
  const searchQuery = searchBar.value;

  // prevent sending an empty query
  if (searchQuery.length === 0) return; 

  spotify.searchArtists(searchQuery, {limit: 5})
    .then(queryResults => displayMatches(queryResults));
}

function displayMatches(queryResults) {
  let artistNames = [];
  queryResults.artists.items.forEach(artist => {
    artistNames.push(artist.name);
  });
  console.log(artistNames);
}

searchBar.addEventListener('keyup', fetchMatches);
// const welcome = document.querySelector(".welcome");
// welcome.classList.add("hidden");
//
// const charts = document.querySelector(".charts");
// charts.classList.remove("hidden");

  // spotify.searchArtists(searchQuery)
  //   .then(artistsResp => {
  //     console.log(artistsResp);
  //     const artistId = artistsResp.artists.items[0].id;
  //     spotify.getArtistRelatedArtists(artistId)
  //       .then(relatedArtistsResp => {
  //         new BubbleChart(relatedArtistsResp);
  //
  //         const topArtistResult = artistsResp.artists.items[0];
  //         new RelatedArtistsChart(topArtistResult, relatedArtistsResp);
  //       });
  //   });
