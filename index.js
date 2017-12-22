const express = require('express');
const cookieParser = require('cookie-parser');

const spotifyAuth = require('./lib/spotify-auth');


const app = express();
const port = process.env.PORT || 8080;
