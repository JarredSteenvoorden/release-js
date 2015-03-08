'use strict';

angular.module('app.shared')
    .service('MovieList', ['ReleaseLogFeed', 'SceneSourceFeed', 'ReleasesBbFeed', function (ReleaseLogFeed, SceneSourceFeed, ReleasesBbFeed) {
        var $this = this;
        this.movies = [];

        this.load = function() {
            // Load from scene source
            ReleaseLogFeed.load(function (movies) {
                angular.forEach(movies, function (movie) {
                    $this.movies.push(movie);
                    movie.lookupMetaData();
                });
            });
        };
    }]);
