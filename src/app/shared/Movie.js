'use strict';
//https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc

angular.module('app.shared')
    .factory('Movie', function ($http) {

        /**
         * Constructor
         */
        function Movie(releaseName) {
            // Public properties, assigned to the instance ('this')
            this.releaseName = releaseName;
            this.posterImage = 'assets/poster.png';

            // Extract info from the release name, eg
            // American Heist 2014 DVDRip x264-EXViD

            // Extract year
            var regexResult = /(^|.*)(\d{4})(.*)-(.*|$)/.exec(releaseName);

            if (regexResult && regexResult.length == 5)
            {
                // Movie info
                this.title = regexResult[1].trim();
                this.year = regexResult[2];

                // Release info
                var extraInfo = regexResult[3].replace('LIMITED', '').trim().split(' ');
                this.quality = extraInfo.length >= 3 ? extraInfo[extraInfo.length - 3] : '';
                this.source = extraInfo.length >= 2 ? extraInfo[extraInfo.length - 2] : '';
                this.encoding = extraInfo.length >= 1 ? extraInfo[extraInfo.length - 1] : '';
                this.releaseGroup = regexResult[4];
            }
            else
                this.title = releaseName;

            this.tooltip = this.releaseName.substring(this.releaseName.indexOf(this.year) + 4).trim();

            // Lookup additional info
            var movie = this;
            $http.get('http://www.omdbapi.com/?t=' + movie.title + '&y=' + movie.year + '&tomatoes=true&type=movie&plot=short&r=json').
                success(function(data) {
                    if (data.Response == "True") {

                        if (data.Poster != "N/A")
                            movie.posterImage = data.Poster;

                        movie.plot = data.Plot;

                        movie.imdbId = data.imdbID;
                        movie.imdbRating = data.imdbRating;
                        movie.imdbVotes = data.imdbVotes;

                        movie.tomatoConsensus = data.tomatoConsensus;
                        movie.tomatoMeter = data.tomatoMeter;

                        movie.tomatoRating = data.tomatoRating;
                        movie.tomatoReviews = data.tomatoReviews;
                        movie.tomatoUserRating = data.tomatoUserRating;
                        movie.tomatoUserReviews = data.tomatoUserReviews;

                        movie.tooltip = movie.plot;
                    } else {
                        console.log('Lookup failed for: ' + movie.title + '. ' + data.Error);
                    }
                }).
                error(function(data, status, headers, config) {
                    // log error
                });
        }

        /**
         * Public methods
         */
        Movie.prototype.getQuality = function () {
            return !angular.isNullOrWhitespace(this.quality) ? this.quality : this.source;
        };

        Movie.prototype.getImdbRating = function () {
            if (angular.isNullOrWhitespace(this.imdbRating) || this.imdbRating == "N/A")
                return;

            return this.imdbRating;
        };

        Movie.prototype.getTomatoMeter = function () {
            if (angular.isNullOrWhitespace(this.tomatoMeter) || this.tomatoMeter == "N/A")
                return;

            return this.tomatoMeter;
        };

        Movie.prototype.getImdbStyle = function () {
            return ratingToStyle(this.getImdbRating(), 10);
        };

        Movie.prototype.getTomatoStyle = function () {
            return ratingToStyle(this.getTomatoMeter());
        };

        Movie.prototype.getImdbLink = function () {
            return 'http://www.imdb.com/title/' + this.imdbId + '/';
        };

        /**
         * Private functions
         */
        function ratingToStyle(rating, multiplier) {
            multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;

            if (angular.isNullOrWhitespace(rating))
                return 'rating-none';

            rating = parseInt(rating) * multiplier;

            if (rating >= 70)
                return 'rating-green';
            if (rating >= 50)
                return 'rating-orange';

            return 'rating-red';
        }

        /**
         * Private property
         */
        var possibleRoles = ['admin', 'editor', 'guest'];

        function checkRole(role) {
            return possibleRoles.indexOf(role) !== -1;
        }

        /**
         * Static property
         */
        Movie.possibleRoles = angular.copy(possibleRoles);

        /**a
         * Static method
         */
        Movie.build = function (data) {
            return new Movie(
                data.release_name
            );
        };

        /**
         * Return the constructor function
         */
        return Movie;
    })
;