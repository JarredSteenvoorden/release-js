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
            load: function(title, year) {
                var deferred = $q.defer();

                $http.get('http://www.omdbapi.com/?t=' + title + '&y=' + year + '&tomatoes=true&type=movie&plot=short&r=json',
                    { cache: DSCacheFactory.get(cacheName) })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        // log error
                    });

                return deferred.promise;
            },

            populateMovie: function(movie) {
                this.load(movie.title, movie.year).then(function(data) {
                    if (data.Response == 'True') {

                        if (data.Poster != 'N/A')
                            movie.posterImage = data.Poster;

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
                    } else {
                        console.log('Lookup failed for: ' + movie.title + '. ' + data.Error);
                    }
                });
            }
        };
    }]);
