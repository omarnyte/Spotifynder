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
  console.log(artistResults);

  const html = artistResults.map(artistObject => {
    const name = artistObject.name;
    const id = artistObject.id;
    console.log(name, id);
    return `
      <li class='query-item' data-artistId=${id}>
        <span class="query-item-name">${name}</span>
      </li>
  `;
}).join('');
suggestions.innerHTML = html;
}

// function displayMatches() {
//   const matchArray = findMatches(this.value, cities);
//   const html = matchArray.map(place => {
//     const regex = new RegExp(this.value, 'gi');
//     const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
//     const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
//     return `
//       <li>
//         <span class="name">${cityName}, ${stateName}</span>
//         <span class="population">${numberWithCommas(place.population)}</span>
//       </li>
//     `;
//   }).join('');
//   suggestions.innerHTML = html;
// }
//
// const searchInput = document.querySelector('.search');
// const suggestions = document.querySelector('.suggestions');
