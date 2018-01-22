export default class Graph {
  constructor(relatedArtists) {
    // console.log('related artists', relatedArtists);
    this.render(relatedArtists);
  }

  render(relatedArtists) {
    this.populateGraph(relatedArtists);
  }

  populateGraph(relatedArtists) {
    // clears previous graph
    const graph = document.querySelector('.graph');
    graph.innerHTML = '';

    let genreCount = this.countGenres(relatedArtists);
    console.log('genre count', genreCount);

    // const graph = document.querySelector('.graph');
    // Object.keys(genreCount).forEach(genre => {
    //   var bar = document.createElement('rect');
    //   bar.setAttribute('width', '500');
    //   bar.setAttribute('height', '500');
    //   // bar.setAttribute('fill', '#'+Math.round(0xffffff * Math.random()).toString(16));
    //   bar.style.fill = 'rgb(0,0,255)';
    //   graph.appendChild(bar);
    // });

    var svgns = "http://www.w3.org/2000/svg";
    let y = 0;
    Object.keys(genreCount).forEach(genre => {
      const width = genreCount[genre] * 30;
      y += 30;

      var rect = document.createElementNS(svgns, 'rect');
      rect.setAttributeNS(null, 'y', y);
      rect.setAttributeNS(null, 'height', '25');
      rect.setAttributeNS(null, 'width', width);
      rect.setAttributeNS(null, 'fill', '#'+Math.round(0xffffff * Math.random()).toString(16));
      graph.appendChild(rect);
    });
    console.log(document.querySelectorAll('rect'));
  }

  countGenres(relatedArtists) {
    let genreCounter = {};

    relatedArtists.artists.forEach(artist => {
      artist.genres.forEach(genre => {
        if (genreCounter[genre]) {
          genreCounter[genre] += 1;
        } else {
          genreCounter[genre] = 1;
        }
      });
    });

    // console.log(genreCounter);
    return genreCounter;
  }


}
