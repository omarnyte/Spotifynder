import BubbleChart from './bubble_chart';
import RelatedArtistsChart from './related_artists';

import Spotify from 'spotify-web-api-js';

const spotify = new Spotify();

// prevent submission of form
const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", e => {
  e.preventDefault();
});

const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('keyup', fetchMatches);

const suggestions = document.querySelector('.suggestions');

function fetchMatches(e) {
  const searchQuery = searchBar.value;

  // prevent sending an empty query after deleting
  if (searchQuery.length === 0) return;

  spotify.searchArtists(searchQuery, {limit: 5})
    .then(queryResults => displayMatches(queryResults));
}

function displayMatches(queryResults) {
  const artistResults = queryResults.artists.items;

  const html = artistResults.map(artistObject => {
    const name = artistObject.name;
    const id = artistObject.id;
    return `
      <li class='suggestions-item'>
        <span class="suggestions-item-name" data-artistId=${id}>${name}</span>
      </li>
  `;
  }).join('');
  suggestions.innerHTML = html;

  appendEventListeners();
}

function appendEventListeners() {
  const artistNameSpans = document.querySelectorAll('.suggestions-item-name');
  // console.log(searchResultItems);
  artistNameSpans.forEach(name => {
    name.addEventListener('click', createCharts);
  });
}

function createCharts(e) {
  const welcome = document.querySelector(".welcome");
  welcome.classList.add("hidden");

  const charts = document.querySelector(".charts");
  charts.classList.remove("hidden");

  const artistName = e.target.textContent;
  console.log(e);
  const artistId = e.target.dataset.artistid;

  spotify.getArtistRelatedArtists(artistId)
    .then(relatedArtistsResp => {
      new BubbleChart(relatedArtistsResp);
      new RelatedArtistsChart(artistName, relatedArtistsResp);
    });
}
