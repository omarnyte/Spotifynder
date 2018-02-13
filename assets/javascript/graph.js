export default class Graph {
  constructor(relatedArtists) {
    this.render(relatedArtists);
  }

  render(relatedArtists) {
    console.log(relatedArtists);
    this.populateGraph(relatedArtists);
    this.appendListenersToBars();
  }

  populateGraph(relatedArtists) {
    const graph = document.querySelector('.graph');

    // clears previous graph, if any
    graph.innerHTML = '';

    let genreCount = this.countGenres(relatedArtists);

    Object.keys(genreCount).forEach(genre => {
      // create each row (which includes the genre name, count, and bar)
      const graphRow = document.createElement('div');
      graphRow.className = 'graph-row';
      graph.appendChild(graphRow);

      // create the genre name div (to flex) and span
      const genreDiv = document.createElement('div');
      genreDiv.className = 'genre-div';
      graphRow.appendChild(genreDiv);

      const genreName = document.createElement('span');
      genreName.className = 'genre-name';
      genreName.innerText = `${genre} (${genreCount[genre]['count']})`;
      genreDiv.appendChild(genreName);

      // create bars
      const bar = document.createElement('div');
      const width = genreCount[genre]['count'] * 40;
      bar.className = 'bar';
      bar.style.height = '25px';
      bar.style.width = `${width}px`;
      bar.dataset.artistIds = genreCount[genre]['artistIds'];
      bar.dataset.genre = genre;
      graphRow.append(bar);

    });
  }

  countGenres(relatedArtists) {
    let genreCounter = {};

    relatedArtists.artists.forEach(artist => {
      artist.genres.forEach(genre => {
        if (genreCounter[genre]) {
          genreCounter[genre]['count'] += 1;
          genreCounter[genre]['artistIds'].push(artist.id);
        } else {
          genreCounter[genre] = {
            'count': 1,
            'artistIds': [artist.id]
          };
        }
      });
    });

    return genreCounter;
  }

  appendListenersToBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
      bar.addEventListener('mouseenter', this.highlightArtists);
    });
    bars.forEach(bar => {
      bar.addEventListener('mouseleave', this.removeHighlights);
    });
  }

  highlightArtists(e) {
    const artistIdList = e.target.dataset.artistIds;

    const allArtistNames = document.querySelectorAll('.related-artist-name');
    allArtistNames.forEach(artistName => {
      if (artistIdList.includes(artistName.dataset.artistid)) {
        artistName.classList.add('highlighted');
      }
    });
  }

  removeHighlights(e) {
    const highlightedArtists = document.querySelectorAll('.related-artist-name.highlighted');
    highlightedArtists.forEach(artist => {
      artist.className = 'related-artist-name';
    });
  }
}
