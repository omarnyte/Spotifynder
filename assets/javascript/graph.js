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
    const genreNames = document.querySelector('.genre-names');

    // clears previous graph, if any
    genreNames.innerHTML = '';
    graph.innerHTML = '';

    let genreCount = this.countGenres(relatedArtists);
    console.log(genreCount);

    Object.keys(genreCount).forEach(genre => {
      const bar = document.createElement('div');
      const width = genreCount[genre]['count'] * 40;

      // create bars
      bar.className = 'bar';
      bar.style.height = '25px';
      bar.style.width = `${width}px`;
      bar.dataset.artistIds = genreCount[genre]['artistIds'];
      bar.dataset.genre = genre;
      graph.append(bar);

      // create genre count span
      // const count = document.createElement('span');
      // count.innerText = genreCount[genre]['count'];
      // bar.appendChild(count);

      // create genre span
      const genreName = document.createElement('span');
      genreName.innerText = `${genre} (${genreCount[genre]['count']})`;
      genreNames.appendChild(genreName);
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
