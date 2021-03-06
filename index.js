const express = require('express');
const request = require('request');
const cookieParser = require('cookie-parser');

const spotifyAuth = require('./lib/spotify-auth');

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

app.get('/callback', (req, res) => {
  res.send(token);
});
