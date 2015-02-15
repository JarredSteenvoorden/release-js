'use strict';

angular.module('app.shared')
    .service('MovieList', ['SceneSourceFeed', 'ReleaseLogFeed', function (SceneSourceFeed, ReleaseLogFeed) {
        var $this = this;
        this.movies = [];

        this.load = function() {
            // Load from scene source
            SceneSourceFeed.load(function (movies) {
                angular.forEach(movies, function (movie) {
                    $this.movies.push(movie);
                });
            });
        };
    }]);
