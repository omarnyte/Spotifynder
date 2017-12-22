import Spotify from 'spotify-web-api-js';

const spotify = new Spotify();

export default class relatedArtists {
  constructor(relatedArtistsResp){
    this.render(relatedArtistsResp);
  }

  render(relatedArtistsResp) {
    this.populateChart(relatedArtistsResp);
    this.populateAudioSources(relatedArtistsResp);

  function playPreview(e) {
    console.log(e.srcElement.attributes[2]);

    // const audio = document.querySelector(`previews[data-artistId="${e.keyCode}"]`);
    const audio = document.querySelector(`audio[data-artistid="4uSftVc3FPWe6RJuMZNEe9"]`);
    console.log('audio', audio);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }

  const thumbnails = Array.from(document.querySelectorAll('.related-artist-thumbnail'));
  console.log('so many thumbnails!');
  thumbnails.forEach(thumbnail => thumbnail.addEventListener('mouseover', playPreview));
  }

  populateChart(relatedArtistsResp) {
    const relatedArtistsChart = document.querySelector(".related-artists-chart");

    const h1 = document.createElement("h1");
    h1.textContent = "Related Artists";
    relatedArtistsChart.appendChild(h1);

    relatedArtistsResp.artists.forEach((artist, idx) => {
      const div = document.createElement("div");
      div.className = 'related-artists-item-div';
      relatedArtistsChart.appendChild(div);

      const img = document.createElement("img");
      img.className = 'related-artist-thumbnail';
      img.src = this.selectImageThumbnail(artist.images);
      img.setAttribute('data-artistId', artist.id);
      div.appendChild(img);

      const span = document.createElement("span");
      span.textContent = artist.name;
      span.className = 'related-artist-names';
      div.appendChild(span);
    });
  }

  // Selects the first image whose height/width ratio is 1/1.
  selectImageThumbnail(images) {
    let imageRatios = [];
    for(let i = 0; i<images.length; i++ ) {
      if (images[i].height === images[i].width) {
        return images[i].url;
      } else {
        return images[0].url;
      }
    }
  }

  // parse related artists object by iterating over each related
  // artist, fetching their top tracks, and appending audio tags for
  // each related artist's top song
  populateAudioSources(relatedArtistsResp) {
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
  }


  // playPreview(e) {
  //   const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  //   const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  //   if (!audio) return;
  //   key.classList.add('playing');
  //   audio.currentTime = 0;
  //   audio.play();
  // }
}
