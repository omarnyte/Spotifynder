import RelatedArtistsChart from './related_artists';
import Graph from './graph';
// import BubbleChart from './bubble_chart';

import Spotify from 'spotify-web-api-js';


const spotify = new Spotify();

let recording = false;

const mic = document.querySelector('.microphone');
const newSearchButton = document.querySelector('.new-search-button');
const searchBar = document.querySelector('.search-bar');
const searchForm = document.querySelector('.search-form');
const searchModal = document.querySelector(".search-modal");
const suggestions = document.querySelector('.suggestions');


function fetchMatches(e) {
  const searchQuery = searchBar.value;

  // prevent sending an empty query and remove search results
  if (searchQuery.length === 0) {
      suggestions.classList.add('hidden');
      suggestions.innerHTML = '';
      return;
  }

  spotify.searchArtists(searchQuery, {limit: 5})
    .then(queryResults => displayMatches(queryResults));
}

function displayMatches(queryResults) {
  const artistResults = queryResults.artists.items;

  suggestions.classList.remove('hidden');

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
  // Hide search modal and reveal charts
  searchModal.classList.add("hidden");
  suggestions.innerHTML = '';
  searchForm.reset();

  // charts.classList.remove("hidden");

  const artistName = e.target.textContent;
  const artistId = e.target.dataset.artistid;

  spotify.getArtistRelatedArtists(artistId)
    .then(relatedArtistsResp => {
      new RelatedArtistsChart(artistName, relatedArtistsResp);
      // new BubbleChart(relatedArtistsResp);
      new Graph(relatedArtistsResp);
    });
}

function record() {
  recording = true;
  mic.classList.add('recording');
  console.log('recording', recording);

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.start();

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

      searchBar.value = transcript;
      console.log(transcript);
  });
}

function stopRecording() {
  if (recording == false) return;

  recording = false;
  mic.classList.remove('recording');
  console.log('recording', recording);
}

// prevent submission of form
searchForm.addEventListener("submit", e => {
  e.preventDefault();
});
searchBar.addEventListener('keyup', fetchMatches);
mic.addEventListener('mousedown', record);
document.addEventListener('mouseup', stopRecording);
newSearchButton.addEventListener('click', () =>
  searchModal.classList.remove('hidden')
);
