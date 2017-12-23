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
      <li class='search-result-item' data-artistId=${id}>
        <span class="search-result-item-name">${name}</span>
      </li>
  `;
  }).join('');
  suggestions.innerHTML = html;

  appendEventListeners();
}

function appendEventListeners() {
  const searchResultItems = document.querySelectorAll('.search-result-item');
  console.log(searchResultItems);
  searchResultItems.forEach(item => {
    item.addEventListener('click', createCharts);
  });
}

function createCharts(e) {
  console.log('clicked!');
}


// const keys = Array.from(document.querySelectorAll('.key'));
// keys.forEach(key => key.addEventListener('transitionend', removeTransition));
// window.addEventListener('keydown', playSound);
