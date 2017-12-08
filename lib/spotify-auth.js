// API code provided by https://github.com/sperrow/js-project

const request = require('request');
// const config = require('./config');

module.exports = (cb) => {
  const clientId = '558c3188b3614330a11f9cfaab96bdff';
  const clientSecret = '9efb973b04704994bac7a7c8d9c671b7';

  // application requests authorization
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  return request.post(authOptions, cb);
};
