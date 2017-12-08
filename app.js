// API code provided by https://github.com/sperrow/js-project

const spotifyAuth = require('./lib/spotify-auth');
const path = require('path');
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/'))
   .use(cookieParser());

let token;

spotifyAuth((err, resp, body) => {
  token = body.access_token;
  console.log(`Listening on ${port}`);
  app.listen(port);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/callback', (req, res) => {
  res.send(token);
});
