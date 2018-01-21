export default class Graph {
  constructor(relatedArtists) {
    // console.log('related artists', relatedArtists);
    this.render(relatedArtists);
  }

  render(relatedArtists) {
    this.populateGraph(relatedArtists);
  }

  populateGraph(relatedArtists) {
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

    var ctx = document.querySelector('.graph').getContext('2d');
    var myBarChart = new Chart(ctx, {
      type: 'bar',

   // The data for our dataset
   data: {
       labels: Object.keys(genreCount),
       datasets: [{
           label: "My First dataset",
           backgroundColor: 'rgb(255, 99, 132)',
           borderColor: 'rgb(255, 99, 132)',
           data: Object.values(genreCount),
       }]
   },

   // Configuration options go here
   options: {}
    });
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
