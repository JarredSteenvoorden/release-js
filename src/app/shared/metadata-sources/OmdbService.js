// The Open Movie Database
// http://www.omdbapi.com/

'use strict';

angular.module('app.shared')
    .service('OmdbService', ['$q', '$http', 'DSCacheFactory', function ($q, $http, DSCacheFactory) {
        var cacheName = 'OmdbCache';

        DSCacheFactory(cacheName, {
            capacity: 500,                  // Store a maximum of 500 responses
            maxAge: 24 * 60 * 60 * 1000,    // Items added to this cache expire after 1 day.
            setRecycleFreq: 60 * 60 * 1000, // Check for expired items every hour
            deleteOnExpire: 'aggressive',   // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage'     // This cache will sync itself with `localStorage`.
        });

        return {
            get: function(search) {
                var deferred = $q.defer();

                $http.get('http://www.omdbapi.com/?' + search + '&tomatoes=true&type=movie&plot=short&r=json',
                    { cache: DSCacheFactory.get(cacheName) })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.resolve();
                    });

                return deferred.promise;
            },

            getByTitle: function(title, year) {
                return this.get('t=' + title + '&y=' + year);
            },

            getByImdbId: function(imdbId) {
                return this.get('i=' + imdbId);
            },

            populate: function(movie, data) {
                // Cannot use IMDB poster images, give 403 when running outside of localhost
                /*if (data.Poster != 'N/A')
                 movie.posterImage = data.Poster;*/

                movie.title = data.Title != 'N/A' ? data.Title : movie.title;
                movie.genres = data.Genre;
                movie.plot = data.Plot;

                movie.imdbId = data.imdbID;
                movie.imdbRating = data.imdbRating != 'N/A' ? data.imdbRating : movie.imdbRating;
                movie.imdbVotes = data.imdbVotes;

                movie.tomatoConsensus = data.tomatoConsensus != 'N/A' ? data.tomatoConsensus : movie.tomatoConsensus;
                movie.tomatoMeter = data.tomatoMeter != 'N/A' ? data.tomatoMeter : movie.tomatoMeter;
                movie.tomatoRating = data.tomatoRating != 'N/A' ? data.tomatoRating : movie.tomatoRating;
                movie.tomatoReviews = data.tomatoReviews;
                movie.tomatoUserRating = data.tomatoUserRating;
                movie.tomatoUserReviews = data.tomatoUserReviews;

                movie.tooltip = movie.plot;
            },

            populateMovie: function(movie) {
                var deferred = $q.defer();
                var $this = this;

                // Try getting the movie by it's title first
                $this.getByTitle(movie.title, movie.year).then(function(data) {
                    if (data && data.Response == 'True') {

                        $this.populate(movie, data);
                        deferred.resolve(true);
                    } else {
                        // Failed lookup using title, attempt with IMDB id
                        console.log('Lookup failed for: "' + movie.title + '" using title, will try IMDB Id. ' + data.Error);
                        if (!angular.isNullOrWhitespace(movie.imdbId)) {
                            $this.getByImdbId(movie.imdbId).then(function(data) {
                                if (data && data.Response == 'True') {

                                    $this.populate(movie, data);
                                    deferred.resolve(true);
                                } else {
                                    console.log('Lookup failed for: "' + movie.title + '" using IMDB Id. ' + data.Error);
                                    data.resolve(false);
                                }
                            });
                        }
                        else
                            data.resolve(false);
                    }
                });

                return deferred.promise;
            }
        };
    }]);
