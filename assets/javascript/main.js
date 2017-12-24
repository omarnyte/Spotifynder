import Spotify from 'spotify-web-api-js';

import Search from './search';
import RelatedArtistsChart from './related_artists';
import BubbleChart from './bubble_chart';

const spotify = new Spotify();

let token;

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    console.log('token', token);
    spotify.setAccessToken(token);
  }
  // TODO on error, attempt to get new token
});
