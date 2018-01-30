export default class Graph {
  constructor(relatedArtists) {
    // console.log('related artists', relatedArtists);
    this.render(relatedArtists);
  }

  render(relatedArtists) {
    this.populateGraph(relatedArtists);
    this.appendListenersToBars();
  }

  populateGraph(relatedArtists) {
    const graph = document.querySelector('.graph');
    // console.log('graph', graph);
    const genreNames = document.querySelector('.genre-names');

    // clears previous graph
    genreNames.innerHTML = '';
    graph.innerHTML = '';

    let genreCount = this.countGenres(relatedArtists);
    // console.log('genre count', genreCount);

    Object.keys(genreCount).forEach(genre => {
      const bar = document.createElement('div');
      const width = genreCount[genre]['count'] * 40;

      bar.className = 'bar';
      bar.style.height = '25px';
      bar.style.width = `${width}px`;
      bar.dataset.artistIds = genreCount[genre]['artistIds'];
      graph.append(bar);

      const genreName = document.createElement('span');
      genreName.innerHTML = genre;
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
