const request = require('request');

let spotifyClientId;
let spotifyClientSecret;

if (process.env.CLIENT_ID) {
  spotifyClientId = process.env.CLIENT_ID;
  spotifyClientSecret = process.env.CLIENT_SECRET;
} else {
  const config = require('../config/keys');
  spotifyClientId = config.spotfiyClientId;
  spotifyClientSecret = config.spotifylientSecret;
}

module.exports = (cb) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(spotifyClientId + ':' + spotifyClientSecret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  return request.post(authOptions, cb);
};
