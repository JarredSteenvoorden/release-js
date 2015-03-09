'use strict';

angular.module('app.shared')
    .service('MovieList', ['ReleaseLogFeed', 'SceperFeed', 'SceneSourceFeed', 'ReleasesBbFeed', function (ReleaseLogFeed, SceperFeed, SceneSourceFeed, ReleasesBbFeed) {
        var $this = this;
        this.movies = [];
        this.movieReleaseNames = [];

        this.load = function() {
            // Load from scene source
            //this.loadFromSource1();

            this.loadFeed(ReleaseLogFeed);
            this.loadFeed(SceperFeed);
            this.loadFeed(SceneSourceFeed);
            this.loadFeed(ReleasesBbFeed);
        };

        this.loadFeed = function(feed) {
            feed.load(function (movies) {
                var results = [];
                angular.forEach(movies, function (movie) {
                    results.push(movie);
                });

                $this.processResults(results);
            });
        };

        this.processResults = function(results) {
            angular.forEach(results, function (movie) {

                // Get a comparable release name (remove special characters)
                var releaseName = movie.releaseName
                    .replace(/[^\w\s]/gi, '')
                    .toLowerCase().trim();

                // Don't duplicate releases
                if ($this.movieReleaseNames.indexOf(releaseName) < 0) {
                    movie.lookupMetaData();
                    $this.movies.push(movie);
                    $this.movieReleaseNames.push(releaseName);
                }
            });

            // Sort movies by publish date
            $this.movies.sort(function(a, b) { return b.releaseDate - a.releaseDate; });
        };
    }]);
