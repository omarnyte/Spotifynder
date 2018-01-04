import BubbleChart from './bubble_chart';
import RelatedArtistsChart from './related_artists';

import Spotify from 'spotify-web-api-js';


const spotify = new Spotify();

const welcome = document.querySelector(".welcome");
const searchForm = document.querySelector('.search-form');
const searchBar = document.querySelector('.search-bar');
const suggestions = document.querySelector('.suggestions');
const charts = document.querySelector(".charts");


function fetchMatches(e) {
  const searchQuery = searchBar.value;

  // prevent sending an empty query and remove search results
  if (searchQuery.length === 0) {
      suggestions.innerHTML = '';
      return;
  }

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
  // Hide welcome and reveal charts
  // welcome.classList.add("hidden");
  suggestions.innerHTML = '';
  searchForm.reset();
  charts.classList.remove("hidden");

  const artistName = e.target.textContent;
  console.log(e);
  const artistId = e.target.dataset.artistid;

  spotify.getArtistRelatedArtists(artistId)
    .then(relatedArtistsResp => {
      new RelatedArtistsChart(artistName, relatedArtistsResp);
      new BubbleChart(relatedArtistsResp);
    });
}

// prevent submission of form
searchForm.addEventListener("submit", e => {
  e.preventDefault();
});
searchBar.addEventListener('keyup', fetchMatches);
