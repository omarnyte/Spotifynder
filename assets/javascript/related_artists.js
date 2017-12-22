import Spotify from 'spotify-web-api-js';

const spotify = new Spotify();

export default class relatedArtists {
  constructor(relatedArtistsObject){
    this.render(relatedArtistsObject);
  }

  render(relatedArtistsResp) {
    this.populateAudioSources(relatedArtistsResp);

    }

    // parse related artists object, select their top songs, and create
    // audio tags for each related artist's top song
    populateAudioSources(relatedArtistsResp) {
      const relatedArtistsChart = document.querySelector(".related-artists-chart");
      //
      const h1 = document.createElement("h1");
      h1.textContent = "Related Artists";
      relatedArtistsChart.appendChild(h1);

      const ul = document.createElement("ul");
      relatedArtistsChart.appendChild(ul);

      let relatedArtistsIds = [];
      relatedArtistsResp.artists.forEach(relatedArtist => {
        relatedArtistsIds.push(relatedArtist.id);
      });
      console.log('relatedArtistsIds', relatedArtistsIds);
      relatedArtistsIds.forEach(id => {
        const previews = document.querySelector('.previews');
        // console.log('previews', previews);
        let audio = document.createElement('audio');
        spotify.getArtistTopTracks(id, 'US')
        .then(topTracksResp => {
          // console.log('topTracksResp', topTracksResp);
          audio.setAttribute('data-artistId', id); 
          audio.src = topTracksResp.tracks[0].preview_url;
          previews.appendChild(audio);
        });
      });

    //
    // relatedArtistsObject.artists.forEach(function(artist, idx) {
    //   const div = document.createElement("div");
    //   div.className = 'related-artists-item-div';
    //   relatedArtistsDiv.appendChild(div);
    //
    //   const img = document.createElement("img");
    //   img.className = 'related-artist-thumbnail';
    //   img.src = selectImageThumbnail(artist.images);
    //   div.appendChild(img);
    //
    //   const span = document.createElement("span");
    //   span.textContent = artist.name;
    //   span.className = 'related-artist-names';
    //   div.appendChild(span);
    // });
    //
    // // Selects the first image whose height/width ratio is 1/1. Otherwise,
    // // selects the image closest to 1.
    // function selectImageThumbnail(images) {
    //   let imageRatios = [];
    //   for(let i = 0; i<images.length; i++ ) {
    //     if (images[i].height === images[i].width) {
    //       return images[i].url;
    //     } else {
    //       return images[0].url;
    //     }
    //   }
    // }
  }
}
