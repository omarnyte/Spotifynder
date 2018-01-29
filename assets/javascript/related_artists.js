import Spotify from 'spotify-web-api-js';

import Graph from './graph';

const spotify = new Spotify();

export default class relatedArtists {
  constructor(artistName, relatedArtistObject){
    // console.log('artistName', artistName);
    this.render(artistName, relatedArtistObject);
  }

  render(artistName, relatedArtistObject) {
    // clears previous related artists chart
    let relatedArtistsChart = document.querySelector(".related-artists-index");
    relatedArtistsChart.innerHTML = '<div class="previews"></div>';

    this.populateChart(artistName, relatedArtistObject);
    this.populateAudioSources(relatedArtistObject);
    this.appendListenersToArtists();

    // enables 30-second preview when hovering over thumbnail
    const thumbnails = Array.from(document.querySelectorAll('.related-artist-thumbnail'));
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('mouseover', this.togglePreview);
      thumbnail.addEventListener('mouseout', this.togglePreview);
    });
  }

  populateChart(artistName, relatedArtistsObject) {
    const relatedArtistsChart = document.querySelector(".related-artists-index");

    // const h1 = document.createElement("h1");
    // h1.textContent = `Related to ${artistName}`;
    // relatedArtistsChart.appendChild(h1);
    relatedArtistsObject.artists.forEach((artist, idx) => {
      const li = document.createElement("li");
      li.className = 'related-artists-item';
      relatedArtistsChart.appendChild(li);

      const img = document.createElement("img");
      img.className = 'related-artist-thumbnail';
      img.src = this.selectImageThumbnail(artist.images);
      img.setAttribute('data-artistId', artist.id);
      li.appendChild(img);

      const span = document.createElement("span");
      span.textContent = artist.name;
      span.className = 'related-artist-name';
      span.setAttribute('data-artistId', artist.id);
      li.appendChild(span);
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
  populateAudioSources(relatedArtistObject) {
    let relatedArtistsIds = [];
    relatedArtistObject.artists.forEach(relatedArtist => {
      relatedArtistsIds.push(relatedArtist.id);
    });
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

  togglePreview(e) {
    const artistId = e.target.dataset.artistid;
    const audio = document.querySelector(`audio[data-artistid="${artistId}"]`);

    if (window.muted) return;

    if (!audio) return;
    audio.currentTime = 0;
    if(!!audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  fetchNewArtist(e) {
    const id = e.target.dataset.artistid;
    const name = e.target.textContent;

    spotify.getArtistRelatedArtists(id)
      .then(artistsResp => {
        console.log(artistsResp);
        new relatedArtists(name, artistsResp);
        new Graph(artistsResp);
      });
  }

  appendListenersToArtists() {
    const allRelatedArtists = document.querySelectorAll('.related-artist-name');
    allRelatedArtists.forEach(artist => {
      artist.addEventListener('click', this.fetchNewArtist);
    });
  }
}
