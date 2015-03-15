// The Movie Database
// http://www.themoviedb.org/documentation/api
'use strict';

angular.module('app.shared')
    .service('TmdbService', ['$q', '$http', 'DSCacheFactory', function ($q, $http, DSCacheFactory) {
        var cacheName = 'TmdbCache';
        var configurationKey = 'configuration';

        var cache = DSCacheFactory(cacheName, {
            capacity: 500,                  // Store a maximum of 500 responses
            maxAge: 24 * 60 * 60 * 1000,    // Items added to this cache expire after 1 day.
            deleteOnExpire: 'passive',      // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage'     // This cache will sync itself with `localStorage`.
        });

        var configuration;
        var configurationDefer = $q.defer();

        function getConfiguration() {
            // Get config from cache or site if expired
            var configurationExpired;
            configuration = cache.get(configurationKey, { onExpire: function (key, value) { configurationExpired = value; } });
            if (angular.isUndefinedOrNull(configuration))
            {
                theMovieDb.configurations.getConfiguration(
                    function (data) {
                        configuration = JSON.parse(data);
                        cache.put(configurationKey, configuration);
                        configurationDefer.resolve();
                    },
                    function (data) {
                        // Configuration update failed, use old cache value
                        console.log('TMDb failed to retrieve configuration. ' + data);
                        configuration = configurationExpired;
                        cache.put(configurationKey, configuration);
                        configurationDefer.resolve();
                    });
            }
            else
                configurationDefer.resolve();
        }

        getConfiguration();

        return {
            processSearch: function(cacheKey, movieDataExpired, deferred, searchResult) {
                theMovieDb.movies.getById({id: searchResult.id},
                    function(data) {
                        var movieData = JSON.parse(data);
                        cache.put(cacheKey, movieData);
                        deferred.resolve(movieData);
                    },
                    function(data) {
                        console.log('TMDb lookup for ' + cacheKey + ' by id ' + searchResult.id + ' failed. ' + data);
                        cache.put(cacheKey, movieDataExpired);
                        deferred.resolve(movieDataExpired);
                    }
                );
            },

            get: function(title, year, imdbId) {
                var $this = this;
                var deferred = $q.defer();
                var cacheKey = title + " " + year;

                // Ensure configuration was loaded
                configurationDefer.promise.then(function() {
                    if (angular.isUndefinedOrNull(configuration))
                        deferred.resolve();

                    var movieDataExpired;
                    var movieData = cache.get(cacheKey, { onExpire: function (key, value) { movieDataExpired = value; } });
                    if (angular.isUndefinedOrNull(movieData))
                    {
                        // Search with title and year
                        theMovieDb.search.getMovie({'query': encodeURIComponent(title), 'year': encodeURIComponent(year)},
                            function (data) {
                                var searchResults = JSON.parse(data);
                                if (angular.isArray(searchResults.results) && searchResults.results.length > 0) {
                                    $this.processSearch(cacheKey, movieDataExpired, deferred, searchResults.results[0]);
                                } else {
                                    console.log('TMDb lookup for ' + title + ' with year ' + year + ' failed, no results. Will try without year. ' + data);

                                    // Search with just title
                                    theMovieDb.search.getMovie({'query': encodeURIComponent(title)},
                                        function (data) {
                                            var searchResults = JSON.parse(data);
                                            if (angular.isArray(searchResults.results) && searchResults.results.length > 0) {
                                                $this.processSearch(cacheKey, movieDataExpired, deferred, searchResults.results[0]);
                                            } else {
                                                var imdbMessage = angular.isNullOrWhitespace(imdbId) ? 'No IMDB id, giving up. ' : 'Will try with IMDB id. '
                                                console.log('TMDb lookup for ' + title + ' without year failed, no results. ' + imdbMessage + data);

                                                // Search with IMDB id provided by feed
                                                if (!angular.isNullOrWhitespace(imdbId)) {
                                                    theMovieDb.find.getById({"id": imdbId, "external_source":"imdb_id"},
                                                        function(data) {
                                                            var searchResults = JSON.parse(data);
                                                            if (angular.isArray(searchResults.movie_results) && searchResults.movie_results.length > 0) {
                                                                $this.processSearch(cacheKey, movieDataExpired, deferred, searchResults.movie_results[0]);
                                                            } else {
                                                                console.log('TMDb lookup for ' + title + ' using IMDB id ' + imdbId + ' failed, no results. Giving up. ' + data);
                                                                cache.put(cacheKey, movieDataExpired);
                                                                deferred.resolve(movieDataExpired);
                                                            }
                                                        },
                                                        function(data) {
                                                            // Movie update failed, use old cache value
                                                            console.log('TMDb lookup for ' + title + ' using IMDB id ' + imdbId + ' failed. ' + data);
                                                            cache.put(cacheKey, movieDataExpired);
                                                            deferred.resolve(movieDataExpired);
                                                        });
                                                } else {
                                                    cache.put(cacheKey, movieDataExpired);
                                                    deferred.resolve(movieDataExpired);
                                                }
                                            }
                                        },
                                        function (data) {
                                            // Movie update failed, use old cache value
                                            console.log('TMDb lookup for ' + title + ' with year ' + year + ' failed. ' + data);
                                            cache.put(cacheKey, movieDataExpired);
                                            deferred.resolve(movieDataExpired);
                                        }
                                    );
                                }
                            },
                            function (data) {
                                // Movie update failed, use old cache value
                                console.log('TMDb lookup for ' + title + ' with year ' + year + ' failed. ' + data);
                                cache.put(cacheKey, movieDataExpired);
                                deferred.resolve(movieDataExpired);
                            }
                        );
                    }
                    else
                        deferred.resolve(movieData);
                });

                return deferred.promise;
            },

            populateMovie: function(movie) {
                var $this = this;
                var deferred = $q.defer();

                // Try getting the movie by it's title first
                $this.get(movie.title, movie.year, movie.imdbId).then(function(data) {
                    if (!angular.isUndefinedOrNull(data)) {

                        // Correct title (release titles can be wrong) and get temporary overview until we lookup TMDb
                        movie.title = data.title;

                        if (!angular.isNullOrWhitespace(data.overview))
                            movie.plot = data.overview.length <= 280 ? data.overview : data.overview.substr(0, 280) + '...';

                        // Get poster and imdb link in case source didn't provide
                        if (!angular.isNullOrWhitespace(data.poster_path))
                            movie.posterImage = configuration.images.base_url + 'w185' + data.poster_path;

                        movie.imdbId = data.imdb_id;

                        deferred.resolve(true);
                    } else
                        deferred.resolve(false);
                });

                return deferred.promise;
            }
        };
    }]);
