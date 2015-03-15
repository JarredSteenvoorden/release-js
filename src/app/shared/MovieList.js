'use strict';

angular.module('app.shared')
    .service('MovieList', ['Movie', 'ReleaseLogFeed', 'SceperFeed', 'SceneSourceFeed', 'ReleasesBbFeed', function (Movie, ReleaseLogFeed, SceperFeed, SceneSourceFeed, ReleasesBbFeed) {
        var $this = this;
        this.movies = [];
        this.movieByTitle = [];

        this.load = function() {
            // Load from scene source
            //this.loadFromSource1();

            this.loadFeed(ReleaseLogFeed);
            this.loadFeed(SceperFeed);
            this.loadFeed(SceneSourceFeed);
            this.loadFeed(ReleasesBbFeed);
        };

        this.loadFeed = function(feed) {
            feed.load(function (releases) {
                $this.processResults(releases);
            });
        };

        this.processResults = function(releases) {
            angular.forEach(releases, function (release) {

                // Get a comparable title (remove special characters)
                var title = release.title
                    .replace(/[^\w\s]/gi, '')
                    .toLowerCase().trim();

                var movie = $this.movieByTitle[title];

                if (angular.isUndefinedOrNull(movie)) {
                    movie = new Movie(release);
                    $this.movieByTitle[title] = movie;
                    $this.movies.push(movie);

                    movie.lookupMetaData();
                } else
                    movie.addRelease(release);
            });

            // Sort movies by publish date
            $this.movies.sort(function(a, b) { return b.latestRelease.date - a.latestRelease.date; });
        };
    }]);
