/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_spotify_web_api_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_spotify_web_api_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_spotify_web_api_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__related_artists__ = __webpack_require__(3);
// API code provided by https://github.com/sperrow/js-project

const s = new __WEBPACK_IMPORTED_MODULE_0_spotify_web_api_js___default.a();

// import Search from './search';


let token;

$.ajax({
  url: '/callback',
  success: function(response) {
    token = response;
    console.log(token);
    s.setAccessToken(token);
  }
  // TODO on error, attempt to get new token
});

document.addEventListener("DOMContentLoaded", function(event) {
  const searchForm = document.querySelector(".search-form");

  searchForm.addEventListener("submit", e => {
    e.preventDefault();

    const searchQuery = document.querySelector(".search-bar");
    console.log(searchQuery.value);
    const artistID = searchQuery.value;
    searchQuery.value = "";

      s.getArtistRelatedArtists(artistID)
        .then(resp => {
          console.log(resp);
          new __WEBPACK_IMPORTED_MODULE_1__related_artists__["a" /* default */](resp);
          // let url = data.tracks.items[0].preview_url;
          // const container = document.getElementById('results');
          // let audio = document.createElement('audio');
          // audio.setAttribute('src', url);
          // audio.setAttribute('controls', 'controls');
          // container.appendChild(audio);
        });
      });
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global module */


/**
 * Class representing the API
 */
var SpotifyWebApi = (function() {
  var _baseUri = 'https://api.spotify.com/v1';
  var _accessToken = null;
  var _promiseImplementation = null;

  var WrapPromiseWithAbort = function(promise, onAbort) {
    promise.abort = onAbort;
    return promise;
  };

  var _promiseProvider = function(promiseFunction, onAbort) {
    var returnedPromise;
    if (_promiseImplementation !== null) {
      var deferred = _promiseImplementation.defer();
      promiseFunction(
        function(resolvedResult) {
          deferred.resolve(resolvedResult);
        },
        function(rejectedResult) {
          deferred.reject(rejectedResult);
        }
      );
      returnedPromise = deferred.promise;
    } else {
      if (window.Promise) {
        returnedPromise = new window.Promise(promiseFunction);
      }
    }

    if (returnedPromise) {
      return new WrapPromiseWithAbort(returnedPromise, onAbort);
    } else {
      return null;
    }
  };

  var _extend = function() {
    var args = Array.prototype.slice.call(arguments);
    var target = args[0];
    var objects = args.slice(1);
    target = target || {};
    objects.forEach(function(object) {
      for (var j in object) {
        if (object.hasOwnProperty(j)) {
          target[j] = object[j];
        }
      }
    });
    return target;
  };

  var _buildUrl = function(url, parameters) {
    var qs = '';
    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
      }
    }
    if (qs.length > 0) {
      // chop off last '&'
      qs = qs.substring(0, qs.length - 1);
      url = url + '?' + qs;
    }
    return url;
  };

  var _performRequest = function(requestData, callback) {
    var req = new XMLHttpRequest();

    var promiseFunction = function(resolve, reject) {
      function success(data) {
        if (resolve) {
          resolve(data);
        }
        if (callback) {
          callback(null, data);
        }
      }

      function failure() {
        if (reject) {
          reject(req);
        }
        if (callback) {
          callback(req, null);
        }
      }

      var type = requestData.type || 'GET';
      req.open(type, _buildUrl(requestData.url, requestData.params));
      if (_accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
      }

      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {
            console.error(e);
          }

          if (req.status >= 200 && req.status < 300) {
            success(data);
          } else {
            failure();
          }
        }
      };

      if (type === 'GET') {
        req.send(null);
      } else {
        req.send(requestData.postData ? JSON.stringify(requestData.postData) : null);
      }
    };

    if (callback) {
      promiseFunction();
      return null;
    } else {
      return _promiseProvider(promiseFunction, function() {
        req.abort();
      });
    }
  };

  var _checkParamsAndPerformRequest = function(requestData, options, callback, optionsAlwaysExtendParams) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }

    // options extend postData, if any. Otherwise they extend parameters sent in the url
    var type = requestData.type || 'GET';
    if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
      requestData.postData = _extend(requestData.postData, opt);
    } else {
      requestData.params = _extend(requestData.params, opt);
    }
    return _performRequest(requestData, cb);
  };

  /**
   * Creates an instance of the wrapper
   * @constructor
   */
  var Constr = function() {};

  Constr.prototype = {
    constructor: SpotifyWebApi
  };

  /**
   * Fetches a resource through a generic GET request.
   *
   * @param {string} url The URL to be fetched
   * @param {function(Object,Object)} callback An optional callback
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getGeneric = function(url, callback) {
    var requestData = {
      url: url
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Fetches information about the current user.
   * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMe = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches current user's saved tracks.
   * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedTracks = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds a list of tracks to the current user's saved tracks.
   * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks',
      type: 'PUT',
      postData: trackIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove a list of tracks from the current user's saved tracks.
   * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks',
      type: 'DELETE',
      postData: trackIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Checks if the current user's saved tracks contains a certain list of tracks.
   * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks/contains',
      params: { ids: trackIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of the albums saved in the current Spotify user's "Your Music" library.
   * See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedAlbums = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Save one or more albums to the current user's "Your Music" library.
   * See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums',
      type: 'PUT',
      postData: albumIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove one or more albums from the current user's "Your Music" library.
   * See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums',
      type: 'DELETE',
      postData: albumIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
   * See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums/contains',
      params: { ids: albumIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the current user’s top artists based on calculated affinity.
   * See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyTopArtists = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/top/artists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the current user’s top tracks based on calculated affinity.
   * See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyTopTracks = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/top/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get tracks from the current user’s recently played tracks.
   * See [Get Current User’s Recently Played Tracks](https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyRecentlyPlayedTracks = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/recently-played'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds the current user as a follower of one or more other Spotify users.
   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followUsers = function(userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'PUT',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Adds the current user as a follower of one or more artists.
   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followArtists = function(artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'PUT',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Add the current user as a follower of one playlist.
   * See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} ownerId The id of the playlist owner. If you know the Spotify URI of
   * the playlist, it is easy to find the owner's user id
   * (e.g. spotify:user:<here_is_the_owner_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed. For instance,
   * whether you want the playlist to be followed privately ({public: false})
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followPlaylist = function(ownerId, playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(ownerId) + '/playlists/' + playlistId + '/followers',
      type: 'PUT',
      postData: {}
    };

    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Removes the current user as a follower of one or more other Spotify users.
   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowUsers = function(userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'DELETE',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Removes the current user as a follower of one or more artists.
   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowArtists = function(artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'DELETE',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Remove the current user as a follower of one playlist.
   * See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} ownerId The id of the playlist owner. If you know the Spotify URI of
   * the playlist, it is easy to find the owner's user id
   * (e.g. spotify:user:<here_is_the_owner_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowPlaylist = function(ownerId, playlistId, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(ownerId) + '/playlists/' + playlistId + '/followers',
      type: 'DELETE'
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Checks to see if the current user is following one or more other Spotify users.
   * See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the user is following the users sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.isFollowingUsers = function(userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/contains',
      type: 'GET',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Checks to see if the current user is following one or more artists.
   * See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the user is following the artists sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.isFollowingArtists = function(artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/contains',
      type: 'GET',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Check to see if one or more Spotify users are following a specified playlist.
   * See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} ownerId The id of the playlist owner. If you know the Spotify URI of
   * the playlist, it is easy to find the owner's user id
   * (e.g. spotify:user:<here_is_the_owner_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the users are following the playlist sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.areFollowingPlaylist = function(ownerId, playlistId, userIds, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(ownerId) + '/playlists/' + playlistId + '/followers/contains',
      type: 'GET',
      params: {
        ids: userIds.join(',')
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Get the current user's followed artists.
   * See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} [options] Options, being after and limit.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an object with a paged object containing
   * artists.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
   * artists objects. Not returned if a callback is given.
   */
  Constr.prototype.getFollowedArtists = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/following',
      type: 'GET',
      params: {
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches information about a specific user.
   * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getUser = function(userId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId)
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of the current user's playlists.
   * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
   * the permissions will be used.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getUserPlaylists = function(userId, options, callback) {
    var requestData;
    if (typeof userId === 'string') {
      requestData = {
        url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists'
      };
    } else {
      requestData = {
        url: _baseUri + '/me/playlists'
      };
      callback = options;
      options = userId;
    }
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a specific playlist.
   * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylist = function(userId, playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the tracks from a specific playlist.
   * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylistTracks = function(userId, playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Creates a playlist and stores it in the current user's library.
   * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. You may want to user the "getMe" function to
   * find out the id of the current logged in user
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.createPlaylist = function(userId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists',
      type: 'POST',
      postData: options
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Change a playlist's name and public/private state
   * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. You may want to user the "getMe" function to
   * find out the id of the current logged in user
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.changePlaylistDetails = function(userId, playlistId, data, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId,
      type: 'PUT',
      postData: data
    };
    return _checkParamsAndPerformRequest(requestData, data, callback);
  };

  /**
   * Add tracks to a playlist.
   * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} uris An array of Spotify URIs for the tracks
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addTracksToPlaylist = function(userId, playlistId, uris, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks',
      type: 'POST',
      postData: {
        uris: uris
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback, true);
  };

  /**
   * Replace the tracks of a playlist
   * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} uris An array of Spotify URIs for the tracks
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.replaceTracksInPlaylist = function(userId, playlistId, uris, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks',
      type: 'PUT',
      postData: { uris: uris }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Reorder tracks in a playlist
   * See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {number} rangeStart The position of the first track to be reordered.
   * @param {number} insertBefore The position where the tracks should be inserted. To reorder the tracks to
   * the end of the playlist, simply set insert_before to the position after the last track.
   * @param {Object} options An object with optional parameters (range_length, snapshot_id)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.reorderTracksInPlaylist = function(userId, playlistId, rangeStart, insertBefore, options, callback) {
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks',
      type: 'PUT',
      postData: {
        range_start: rangeStart,
        insert_before: insertBefore
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove tracks from a playlist
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
   * string) and `positions` (which is an array of integers).
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylist = function(userId, playlistId, uris, callback) {
    var dataToBeSent = uris.map(function(uri) {
      if (typeof uri === 'string') {
        return { uri: uri };
      } else {
        return uri;
      }
    });

    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: { tracks: dataToBeSent }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Remove tracks from a playlist, specifying a snapshot id.
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
   * string) and `positions` (which is an array of integers).
   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function(userId, playlistId, uris, snapshotId, callback) {
    var dataToBeSent = uris.map(function(uri) {
      if (typeof uri === 'string') {
        return { uri: uri };
      } else {
        return uri;
      }
    });
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: {
        tracks: dataToBeSent,
        snapshot_id: snapshotId
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Remove tracks from a playlist, specifying the positions of the tracks to be removed.
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<number>} positions array of integers containing the positions of the tracks to remove
   * from the playlist.
   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylistInPositions = function(userId, playlistId, positions, snapshotId, callback) {
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: {
        positions: positions,
        snapshot_id: snapshotId
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Fetches an album from the Spotify catalog.
   * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbum = function(albumId, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/' + albumId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the tracks of an album from the Spotify catalog.
   * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbumTracks = function(albumId, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/' + albumId + '/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple albums from the Spotify catalog.
   * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/',
      params: { ids: albumIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a track from the Spotify catalog.
   * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getTrack = function(trackId, options, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/tracks/' + trackId;
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple tracks from the Spotify catalog.
   * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/tracks/',
      params: { ids: trackIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches an artist from the Spotify catalog.
   * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtist = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple artists from the Spotify catalog.
   * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtists = function(artistIds, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/',
      params: { ids: artistIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the albums of an artist from the Spotify catalog.
   * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistAlbums = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
   * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistTopTracks = function(artistId, countryId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/top-tracks',
      params: { country: countryId }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of artists related with a given one from the Spotify catalog.
   * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistRelatedArtists = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/related-artists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
   * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getFeaturedPlaylists = function(options, callback) {
    var requestData = {
      url: _baseUri + '/browse/featured-playlists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
   * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getNewReleases = function(options, callback) {
    var requestData = {
      url: _baseUri + '/browse/new-releases'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategories = function(options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * See [Get a Category](https://developer.spotify.com/web-api/get-category/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} categoryId The id of the category. These can be found with the getCategories function
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategory = function(categoryId, options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories/' + categoryId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of Spotify playlists tagged with a particular category.
   * See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} categoryId The id of the category. These can be found with the getCategories function
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategoryPlaylists = function(categoryId, options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories/' + categoryId + '/playlists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Array<string>} types An array of item types to search across.
   * Valid types are: 'album', 'artist', 'playlist', and 'track'.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.search = function(query, types, options, callback) {
    var requestData = {
      url: _baseUri + '/search/',
      params: {
        q: query,
        type: types.join(',')
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches albums from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchAlbums = function(query, options, callback) {
    return this.search(query, ['album'], options, callback);
  };

  /**
   * Fetches artists from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchArtists = function(query, options, callback) {
    return this.search(query, ['artist'], options, callback);
  };

  /**
   * Fetches tracks from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchTracks = function(query, options, callback) {
    return this.search(query, ['track'], options, callback);
  };

  /**
   * Fetches playlists from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchPlaylists = function(query, options, callback) {
    return this.search(query, ['playlist'], options, callback);
  };

  /**
   * Get audio features for a single track identified by its unique Spotify ID.
   * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTrack = function(trackId, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/audio-features/' + trackId;
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get audio features for multiple tracks based on their Spotify IDs.
   * See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTracks = function(trackIds, callback) {
    var requestData = {
      url: _baseUri + '/audio-features',
      params: { ids: trackIds }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get audio analysis for a single track identified by its unique Spotify ID.
   * See [Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioAnalysisForTrack = function(trackId, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/audio-analysis/' + trackId;
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Create a playlist-style listening experience based on seed artists, tracks and genres.
   * See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getRecommendations = function(options, callback) {
    var requestData = {
      url: _baseUri + '/recommendations'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Retrieve a list of available genres seed parameter values for recommendations.
   * See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAvailableGenreSeeds = function(callback) {
    var requestData = {
      url: _baseUri + '/recommendations/available-genre-seeds'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get information about a user’s available devices.
   * See [Get a User’s Available Devices](https://developer.spotify.com/web-api/get-a-users-available-devices/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyDevices = function(callback) {
    var requestData = {
      url: _baseUri + '/me/player/devices'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get information about the user’s current playback state, including track, track progress, and active device.
   * See [Get Information About The User’s Current Playback](https://developer.spotify.com/web-api/get-information-about-the-users-current-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyCurrentPlaybackState = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the object currently being played on the user’s Spotify account.
   * See [Get the User’s Currently Playing Track](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyCurrentPlayingTrack = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/currently-playing'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Transfer playback to a new device and determine if it should start playing.
   * See [Transfer a User’s Playback](https://developer.spotify.com/web-api/transfer-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} deviceIds A JSON array containing the ID of the device on which playback should be started/transferred.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.transferMyPlayback = function(deviceIds, options, callback) {
    var postData = options || {};
    postData.device_ids = deviceIds;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player',
      postData: postData
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Start a new context or resume current playback on the user’s active device.
   * See [Start/Resume a User’s Playback](https://developer.spotify.com/web-api/start-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.play = function(options, callback) {
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var postData = {};
    ['context_uri', 'uris', 'offset'].forEach(function(field) {
      if (field in options) {
        postData[field] = options[field];
      }
    });
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/play',
      params: params,
      postData: postData
    };

    // need to clear options so it doesn't add all of them to the query params
    var newOptions = typeof options === 'function' ? options : {};
    return _checkParamsAndPerformRequest(requestData, newOptions, callback);
  };

  /**
   * Pause playback on the user’s account.
   * See [Pause a User’s Playback](https://developer.spotify.com/web-api/pause-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.pause = function(options, callback) {
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/pause',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Skips to next track in the user’s queue.
   * See [Skip User’s Playback To Next Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.skipToNext = function(options, callback) {
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/next',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Skips to previous track in the user’s queue.
   * Note that this will ALWAYS skip to the previous track, regardless of the current track’s progress.
   * Returning to the start of the current track should be performed using `.seek()`
   * See [Skip User’s Playback To Previous Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.skipToPrevious = function(options, callback) {
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/previous',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Seeks to the given position in the user’s currently playing track.
   * See [Seek To Position In Currently Playing Track](https://developer.spotify.com/web-api/seek-to-position-in-currently-playing-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {number} position_ms The position in milliseconds to seek to. Must be a positive number.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.seek = function(position_ms, options, callback) {
    var params = {
      position_ms: position_ms
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/seek',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
   * See [Set Repeat Mode On User’s Playback](https://developer.spotify.com/web-api/set-repeat-mode-on-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {String} state A string set to 'track', 'context' or 'off'.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setRepeat = function(state, options, callback) {
    var params = {
      state: state
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/repeat',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Set the volume for the user’s current playback device.
   * See [Set Volume For User’s Playback](https://developer.spotify.com/web-api/set-volume-for-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {number} volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setVolume = function(volume_percent, options, callback) {
    var params = {
      volume_percent: volume_percent
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/volume',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Toggle shuffle on or off for user’s playback.
   * See [Toggle Shuffle For User’s Playback](https://developer.spotify.com/web-api/toggle-shuffle-for-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {bool} state Whether or not to shuffle user's playback.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setShuffle = function(state, options, callback) {
    var params = {
      state: state
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/shuffle',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Gets the access token in use.
   *
   * @return {string} accessToken The access token
   */
  Constr.prototype.getAccessToken = function() {
    return _accessToken;
  };

  /**
   * Sets the access token to be used.
   * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
   * the Spotify Developer site for more information about obtaining an access token.
   *
   * @param {string} accessToken The access token
   * @return {void}
   */
  Constr.prototype.setAccessToken = function(accessToken) {
    _accessToken = accessToken;
  };

  /**
   * Sets an implementation of Promises/A+ to be used. E.g. Q, when.
   * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
   * for a list of some available options
   *
   * @param {Object} PromiseImplementation A Promises/A+ valid implementation
   * @throws {Error} If the implementation being set doesn't conform with Promises/A+
   * @return {void}
   */
  Constr.prototype.setPromiseImplementation = function(PromiseImplementation) {
    var valid = false;
    try {
      var p = new PromiseImplementation(function(resolve) {
        resolve();
      });
      if (typeof p.then === 'function' && typeof p.catch === 'function') {
        valid = true;
      }
    } catch (e) {
      console.error(e);
    }
    if (valid) {
      _promiseImplementation = PromiseImplementation;
    } else {
      throw new Error('Unsupported implementation of Promises/A+');
    }
  };

  return Constr;
})();

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = SpotifyWebApi;
}


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const testJSONResp = {
  "artists": [
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/6CwfuxIqcltXDGjfZsMd9A"
      },
      "followers": {
        "href": null,
        "total": 1073377
      },
      "genres": [
        "dance pop",
        "metropopolis",
        "pop",
        "post-teen pop"
      ],
      "href": "https://api.spotify.com/v1/artists/6CwfuxIqcltXDGjfZsMd9A",
      "id": "6CwfuxIqcltXDGjfZsMd9A",
      "images": [
        {
          "height": 563,
          "url": "https://i.scdn.co/image/2c1d70e358bb023c53bb39c9ee822fb7685cbde0",
          "width": 1000
        },
        {
          "height": 360,
          "url": "https://i.scdn.co/image/57729303b911d2db981f45dfb1c81e9f86547933",
          "width": 640
        },
        {
          "height": 113,
          "url": "https://i.scdn.co/image/1e2bc43b5292c914b9f4dbc31a05b7592afcbbe3",
          "width": 200
        },
        {
          "height": 36,
          "url": "https://i.scdn.co/image/60a80acfbc285b8d377a22bc4c4a02162838a00a",
          "width": 64
        }
      ],
      "name": "Marina and the Diamonds",
      "popularity": 74,
      "type": "artist",
      "uri": "spotify:artist:6CwfuxIqcltXDGjfZsMd9A"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/6oBm8HB0yfrIc9IHbxs6in"
      },
      "followers": {
        "href": null,
        "total": 941990
      },
      "genres": [
        "alternative dance",
        "chamber pop",
        "folk-pop",
        "indie pop",
        "indie r&b",
        "indietronica",
        "new rave",
        "pop",
        "swedish pop",
        "synthpop",
        "tropical house"
      ],
      "href": "https://api.spotify.com/v1/artists/6oBm8HB0yfrIc9IHbxs6in",
      "id": "6oBm8HB0yfrIc9IHbxs6in",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/11c93f7924d468e3394960a6852faa3da86671f9",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/f9f093536884c6534b194401bd1f731f67022a2e",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/7c50a75981bb079b783cf7b7327cba4c0e8894eb",
          "width": 160
        }
      ],
      "name": "Lykke Li",
      "popularity": 68,
      "type": "artist",
      "uri": "spotify:artist:6oBm8HB0yfrIc9IHbxs6in"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/7pyhre5oEEFMqcgMEvJY7q"
      },
      "followers": {
        "href": null,
        "total": 199204
      },
      "genres": [
        "candy pop",
        "dance pop",
        "escape room",
        "indie poptimism",
        "indie r&b",
        "indietronica",
        "la indie",
        "metropopolis",
        "pop",
        "post-teen pop",
        "synthpop"
      ],
      "href": "https://api.spotify.com/v1/artists/7pyhre5oEEFMqcgMEvJY7q",
      "id": "7pyhre5oEEFMqcgMEvJY7q",
      "images": [
        {
          "height": 751,
          "url": "https://i.scdn.co/image/d36cc5e3dae9279073c49183359a5d75dbc94f04",
          "width": 1000
        },
        {
          "height": 481,
          "url": "https://i.scdn.co/image/6e9dbee4175d5c0a9a949c35a0689ac48c4f370e",
          "width": 640
        },
        {
          "height": 150,
          "url": "https://i.scdn.co/image/07ab733aa5e77b2fa50888e7364d4846f982fd06",
          "width": 200
        },
        {
          "height": 48,
          "url": "https://i.scdn.co/image/418154a0f686d9318690b3d4b49de92796372860",
          "width": 64
        }
      ],
      "name": "Sky Ferreira",
      "popularity": 58,
      "type": "artist",
      "uri": "spotify:artist:7pyhre5oEEFMqcgMEvJY7q"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/2xe8IXgCTpwHE3eA9hTs4n"
      },
      "followers": {
        "href": null,
        "total": 614066
      },
      "genres": [
        "alternative r&b",
        "deep indie r&b",
        "indie poptimism",
        "indie r&b",
        "indietronica",
        "pop",
        "tropical house",
        "vapor soul"
      ],
      "href": "https://api.spotify.com/v1/artists/2xe8IXgCTpwHE3eA9hTs4n",
      "id": "2xe8IXgCTpwHE3eA9hTs4n",
      "images": [
        {
          "height": 633,
          "url": "https://i.scdn.co/image/061479471f5ccda376145d75da5c95df251ccfed",
          "width": 640
        },
        {
          "height": 317,
          "url": "https://i.scdn.co/image/8411bf171225ad015fd2865fc83a089d458d622b",
          "width": 320
        },
        {
          "height": 158,
          "url": "https://i.scdn.co/image/5e09302f6f76495177055d41f0f1a59298f22e36",
          "width": 160
        }
      ],
      "name": "Banks",
      "popularity": 74,
      "type": "artist",
      "uri": "spotify:artist:2xe8IXgCTpwHE3eA9hTs4n"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/163tK9Wjr9P9DmM0AVK7lm"
      },
      "followers": {
        "href": null,
        "total": 2686691
      },
      "genres": [
        "dance pop",
        "metropopolis",
        "pop",
        "post-teen pop"
      ],
      "href": "https://api.spotify.com/v1/artists/163tK9Wjr9P9DmM0AVK7lm",
      "id": "163tK9Wjr9P9DmM0AVK7lm",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/d25fc756cd04c8b3ea196b7c07c6d057685cc405",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/ca2e7772dcdfd03401cdd0c66aeee1bea8ea3904",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/2f22ea3ea1597887d86441a030204dac49a74a81",
          "width": 160
        }
      ],
      "name": "Lorde",
      "popularity": 87,
      "type": "artist",
      "uri": "spotify:artist:163tK9Wjr9P9DmM0AVK7lm"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/3rWZHrfrsPBxVy692yAIxF"
      },
      "followers": {
        "href": null,
        "total": 155775
      },
      "genres": [
        "dance pop",
        "deep indie r&b",
        "escape room",
        "indie r&b",
        "pop",
        "post-teen pop"
      ],
      "href": "https://api.spotify.com/v1/artists/3rWZHrfrsPBxVy692yAIxF",
      "id": "3rWZHrfrsPBxVy692yAIxF",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/ffa1bdfa524bce83cf979f4777e41bfad4f9ec9a",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/f5d458769457290444c15cc600703bd13b10534d",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/d3fe28b989a7992cdf459fb5fa690bb6e9b34449",
          "width": 160
        }
      ],
      "name": "Willow",
      "popularity": 68,
      "type": "artist",
      "uri": "spotify:artist:3rWZHrfrsPBxVy692yAIxF"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/77SW9BnxLY8rJ0RciFqkHh"
      },
      "followers": {
        "href": null,
        "total": 1525144
      },
      "genres": [
        "indie pop",
        "indietronica",
        "modern rock",
        "pop",
        "shimmer pop"
      ],
      "href": "https://api.spotify.com/v1/artists/77SW9BnxLY8rJ0RciFqkHh",
      "id": "77SW9BnxLY8rJ0RciFqkHh",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/fa8a67c71c75a78bdcdabe3b8b07d72ffd30eb81",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/2a4de299e72e99a7d47d7e685dfcb013691782a0",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/5c58c1afbd89b7597d546dae028001452af89c9c",
          "width": 160
        }
      ],
      "name": "The Neighbourhood",
      "popularity": 81,
      "type": "artist",
      "uri": "spotify:artist:77SW9BnxLY8rJ0RciFqkHh"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/100sLnojEpcadRx4edEBA6"
      },
      "followers": {
        "href": null,
        "total": 205934
      },
      "genres": [
        "gauze pop",
        "indie poptimism",
        "indietronica",
        "pop"
      ],
      "href": "https://api.spotify.com/v1/artists/100sLnojEpcadRx4edEBA6",
      "id": "100sLnojEpcadRx4edEBA6",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/04554c79adb7d712bc9a0f11442123b0284089e3",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/28332b8d1233b612a23973d5ae8febdb77af578a",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/6bbbc405097117a8bfb337a1638ac0433b6c89b7",
          "width": 160
        }
      ],
      "name": "Zella Day",
      "popularity": 64,
      "type": "artist",
      "uri": "spotify:artist:100sLnojEpcadRx4edEBA6"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/25uiPmTg16RbhZWAqwLBy5"
      },
      "followers": {
        "href": null,
        "total": 813896
      },
      "genres": [
        "candy pop",
        "dance pop",
        "indie poptimism",
        "metropopolis",
        "pop",
        "post-teen pop",
        "tropical house"
      ],
      "href": "https://api.spotify.com/v1/artists/25uiPmTg16RbhZWAqwLBy5",
      "id": "25uiPmTg16RbhZWAqwLBy5",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/d9c2123cd9e58170e435140390d2c07e7580a756",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/9cf76f9f287f02228d3089942a822b066e8598b2",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/31ef882cfa8cfcc04d9cde2718d9d026635d2b80",
          "width": 160
        }
      ],
      "name": "Charli XCX",
      "popularity": 82,
      "type": "artist",
      "uri": "spotify:artist:25uiPmTg16RbhZWAqwLBy5"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/1moxjboGR7GNWYIMWsRjgG"
      },
      "followers": {
        "href": null,
        "total": 3272185
      },
      "genres": [
        "folk-pop",
        "modern rock",
        "pop"
      ],
      "href": "https://api.spotify.com/v1/artists/1moxjboGR7GNWYIMWsRjgG",
      "id": "1moxjboGR7GNWYIMWsRjgG",
      "images": [
        {
          "height": 1000,
          "url": "https://i.scdn.co/image/fe6148760b68df4c258a5131bd1b7b6f83286540",
          "width": 1000
        },
        {
          "height": 640,
          "url": "https://i.scdn.co/image/eaa4ac2fb065699bde532a88473c2dd21285c60c",
          "width": 640
        },
        {
          "height": 200,
          "url": "https://i.scdn.co/image/0c38f1000f44e7da4e3c324804dbf3f8e2d5a5ec",
          "width": 200
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/7fca47fff1ab14bb3f0b009d7544d7ab137ab728",
          "width": 64
        }
      ],
      "name": "Florence + The Machine",
      "popularity": 79,
      "type": "artist",
      "uri": "spotify:artist:1moxjboGR7GNWYIMWsRjgG"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/7gRhy3MIPHQo5CXYfWaw9I"
      },
      "followers": {
        "href": null,
        "total": 330053
      },
      "genres": [
        "bmore",
        "dance pop",
        "escape room",
        "hip house",
        "hip pop",
        "indie r&b",
        "pop",
        "strut"
      ],
      "href": "https://api.spotify.com/v1/artists/7gRhy3MIPHQo5CXYfWaw9I",
      "id": "7gRhy3MIPHQo5CXYfWaw9I",
      "images": [
        {
          "height": 749,
          "url": "https://i.scdn.co/image/d08b993548a00a5a535e20c9c2aff7b6287dfb1e",
          "width": 1000
        },
        {
          "height": 480,
          "url": "https://i.scdn.co/image/27f49fc753f618acfd40da8c747e9624d25c2d65",
          "width": 640
        },
        {
          "height": 150,
          "url": "https://i.scdn.co/image/61a6df6befdb435d3d4722fa63a5cfc4fb06f8f5",
          "width": 200
        },
        {
          "height": 48,
          "url": "https://i.scdn.co/image/5fd8dcca2d7c58702eb65df34d51c78b33619923",
          "width": 64
        }
      ],
      "name": "Azealia Banks",
      "popularity": 63,
      "type": "artist",
      "uri": "spotify:artist:7gRhy3MIPHQo5CXYfWaw9I"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/053q0ukIDRgzwTr4vNSwab"
      },
      "followers": {
        "href": null,
        "total": 627678
      },
      "genres": [
        "alternative dance",
        "chillwave",
        "dream pop",
        "escape room",
        "grave wave",
        "indie pop",
        "indie r&b",
        "indietronica",
        "metropopolis",
        "new rave",
        "pop",
        "shimmer pop",
        "synthpop"
      ],
      "href": "https://api.spotify.com/v1/artists/053q0ukIDRgzwTr4vNSwab",
      "id": "053q0ukIDRgzwTr4vNSwab",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/458af1613362048785586a6c6c39da7d9d6df3d6",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/16a47f8725743850808f5f084eb3095cfdee8411",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/f5702695add05e1c29019586bcdf2f21638a3718",
          "width": 160
        }
      ],
      "name": "Grimes",
      "popularity": 68,
      "type": "artist",
      "uri": "spotify:artist:053q0ukIDRgzwTr4vNSwab"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/6nB0iY1cjSY1KyhYyuIIKH"
      },
      "followers": {
        "href": null,
        "total": 367367
      },
      "genres": [
        "deep indie r&b",
        "escape room",
        "indie r&b",
        "indietronica",
        "pop",
        "synthpop",
        "trip hop",
        "tropical house"
      ],
      "href": "https://api.spotify.com/v1/artists/6nB0iY1cjSY1KyhYyuIIKH",
      "id": "6nB0iY1cjSY1KyhYyuIIKH",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/0171057ae8b04f6f4992fd567fe440ff2425e26c",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/0c3c01d53553d6c0759abeacefa20069f2a9a133",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/b24d2d1671e59974b4394d4d5838378b6ea8a9d3",
          "width": 160
        }
      ],
      "name": "FKA twigs",
      "popularity": 61,
      "type": "artist",
      "uri": "spotify:artist:6nB0iY1cjSY1KyhYyuIIKH"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/0wnYgCeP013HkKoOyC5V32"
      },
      "followers": {
        "href": null,
        "total": 71216
      },
      "genres": [
        "dance pop",
        "escape room",
        "indie poptimism",
        "indie r&b",
        "indietronica",
        "metropopolis",
        "pop",
        "synthpop",
        "vapor soul"
      ],
      "href": "https://api.spotify.com/v1/artists/0wnYgCeP013HkKoOyC5V32",
      "id": "0wnYgCeP013HkKoOyC5V32",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/aa1f32721c7eab7db277128b3e41b77b9cf14a52",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/929f3563e03b2d602547ff3c39852171f99d0523",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/3e315704235eb37dd9a495bd2301a155f0c953c5",
          "width": 160
        }
      ],
      "name": "Allie X",
      "popularity": 64,
      "type": "artist",
      "uri": "spotify:artist:0wnYgCeP013HkKoOyC5V32"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/2i9uaNzfUtuApAjEf1omV8"
      },
      "followers": {
        "href": null,
        "total": 139213
      },
      "genres": [
        "deep indie r&b",
        "indie folk",
        "indie poptimism",
        "indie r&b",
        "indietronica",
        "pop",
        "shimmer pop",
        "vapor soul"
      ],
      "href": "https://api.spotify.com/v1/artists/2i9uaNzfUtuApAjEf1omV8",
      "id": "2i9uaNzfUtuApAjEf1omV8",
      "images": [
        {
          "height": 1000,
          "url": "https://i.scdn.co/image/9921f520912f341bbf927a7bbc3662da3c6c9d97",
          "width": 1000
        },
        {
          "height": 640,
          "url": "https://i.scdn.co/image/bdd8eafae83ce090ea09589e9bb4075794a4445b",
          "width": 640
        },
        {
          "height": 200,
          "url": "https://i.scdn.co/image/fc32397464433a0c70bae23ba6b71b92a84ebf7c",
          "width": 200
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/ff13a3db3db27c57eac81c088d94a500c6c608cd",
          "width": 64
        }
      ],
      "name": "Wet",
      "popularity": 66,
      "type": "artist",
      "uri": "spotify:artist:2i9uaNzfUtuApAjEf1omV8"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH"
      },
      "followers": {
        "href": null,
        "total": 206880
      },
      "genres": [
        "indie poptimism",
        "pop",
        "vapor soul"
      ],
      "href": "https://api.spotify.com/v1/artists/6qqNVTkY8uBg9cP3Jd7DAH",
      "id": "6qqNVTkY8uBg9cP3Jd7DAH",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/97dbd94a37fe07e9831fed7c89647cb1ad5262f0",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/e7ca72507b6eab0f83a1ceec0eaa42d870dd3907",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/5db2a50e0938638908dac2ed2dcc292365cf1cf0",
          "width": 160
        }
      ],
      "name": "Billie Eilish",
      "popularity": 78,
      "type": "artist",
      "uri": "spotify:artist:6qqNVTkY8uBg9cP3Jd7DAH"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/7bcbShaqKdcyjnmv4Ix8j6"
      },
      "followers": {
        "href": null,
        "total": 324280
      },
      "genres": [
        "alternative dance",
        "alternative rock",
        "chamber pop",
        "chillwave",
        "dream pop",
        "escape room",
        "etherpop",
        "folk-pop",
        "freak folk",
        "indie folk",
        "indie pop",
        "indie r&b",
        "indie rock",
        "indietronica",
        "lo-fi",
        "metropopolis",
        "modern rock",
        "neo-psychedelic",
        "new rave",
        "noise pop",
        "pop",
        "shimmer pop",
        "singer-songwriter",
        "synthpop"
      ],
      "href": "https://api.spotify.com/v1/artists/7bcbShaqKdcyjnmv4Ix8j6",
      "id": "7bcbShaqKdcyjnmv4Ix8j6",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/0a4c9792c52ec21c3b881542e0739d6f605799b8",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/713b5d0c32ed8e8e7189147c8968af38bfc5d928",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/a2a16a6f5c99298fdfcc4b1a07e15bd712df8cff",
          "width": 160
        }
      ],
      "name": "St. Vincent",
      "popularity": 71,
      "type": "artist",
      "uri": "spotify:artist:7bcbShaqKdcyjnmv4Ix8j6"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/4NHQUGzhtTLFvgF5SZesLK"
      },
      "followers": {
        "href": null,
        "total": 1201074
      },
      "genres": [
        "dance pop",
        "edm",
        "metropopolis",
        "pop",
        "post-teen pop",
        "swedish pop",
        "swedish synthpop",
        "tropical house"
      ],
      "href": "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
      "id": "4NHQUGzhtTLFvgF5SZesLK",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/f74839ff35613937b49162997f4087deab2d592c",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/8b35970a418114d27abff77cdc37b1fcd34afd29",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/d3434551481cb758adfffa9cc21669ecc0dc6b15",
          "width": 160
        }
      ],
      "name": "Tove Lo",
      "popularity": 84,
      "type": "artist",
      "uri": "spotify:artist:4NHQUGzhtTLFvgF5SZesLK"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/1U1el3k54VvEUzo3ybLPlM"
      },
      "followers": {
        "href": null,
        "total": 184290
      },
      "genres": [
        "deep indie r&b",
        "escape room",
        "indie r&b"
      ],
      "href": "https://api.spotify.com/v1/artists/1U1el3k54VvEUzo3ybLPlM",
      "id": "1U1el3k54VvEUzo3ybLPlM",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/7e20822c2e2ea5b406851d9d5026f7660c78949a",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/65fc3cf8f79172c3e0a254fc6e998331923b4285",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/024fb6a0fe405f1d5fc4e5118d6f2d1224a0d582",
          "width": 160
        }
      ],
      "name": "Kali Uchis",
      "popularity": 78,
      "type": "artist",
      "uri": "spotify:artist:1U1el3k54VvEUzo3ybLPlM"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/5r5Va4lVQ1zjEfbJSrmCsS"
      },
      "followers": {
        "href": null,
        "total": 301946
      },
      "genres": [
        "etherpop",
        "indie poptimism",
        "indie r&b",
        "indietronica",
        "metropopolis",
        "modern rock",
        "pop",
        "shimmer pop",
        "synthpop",
        "tropical house",
        "vapor soul"
      ],
      "href": "https://api.spotify.com/v1/artists/5r5Va4lVQ1zjEfbJSrmCsS",
      "id": "5r5Va4lVQ1zjEfbJSrmCsS",
      "images": [
        {
          "height": 1000,
          "url": "https://i.scdn.co/image/0d50c7ca4510a8db4fcd3dafd0e14565969c8ea4",
          "width": 1000
        },
        {
          "height": 640,
          "url": "https://i.scdn.co/image/4aad1e347b11b122738d33b68ab85f4ec0c4a74f",
          "width": 640
        },
        {
          "height": 200,
          "url": "https://i.scdn.co/image/c50c650e422546fa51dee2cc57bad82b62b0c360",
          "width": 200
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/5edce89716937e58e2ae2904050d4c0bc49aa635",
          "width": 64
        }
      ],
      "name": "Broods",
      "popularity": 69,
      "type": "artist",
      "uri": "spotify:artist:5r5Va4lVQ1zjEfbJSrmCsS"
    }
  ]
};

class relatedArtists {
  constructor(relatedArtistsObject){
    this.render(relatedArtistsObject);
  }

  render(relatedArtistsObject) {
    const relatedArtistsDiv = document.querySelector(".related-artists-div");

    const h1 = document.createElement("h1");
    h1.textContent = "Related Artists";
    relatedArtistsDiv.appendChild(h1);

    const ul = document.createElement("ul");
    relatedArtistsDiv.appendChild(ul);

    relatedArtistsObject.artists.forEach(function(artist, idx) {
      const div = document.createElement("div");
      div.className = 'related-artists-item-div';
      relatedArtistsDiv.appendChild(div);

      const img = document.createElement("img");
      img.className = 'related-artist-thumbnail';
      img.src = selectImageThumbnail(artist.images);
      div.appendChild(img);

      const span = document.createElement("span");
      span.textContent = artist.name;
      span.className = 'related-artist-names';
      div.appendChild(span);
    });

    // Selects the first image whose height/width ratio is 1/1. Otherwise,
    // selects the image closest to 1.
    function selectImageThumbnail(images) {
      let imageRatios = [];
      for(let i = 0; i<images.length; i++ ) {
        if (images[i].height === images[i].width) {
          return images[i].url;
        } else {
          return images[0].url;
        }
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = relatedArtists;



/***/ })
/******/ ]);