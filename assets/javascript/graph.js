export default class Graph {
  constructor(relatedArtistsResp) {
    console.log(relatedArtistsResp);
    this.countGenres(relatedArtistsResp);
  }

  render(relatedArtists) {
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
    console.log(genreCounter);
    return genreCounter;
  }


}
