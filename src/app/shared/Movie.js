'use strict';
//https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc

angular.module('app.shared')
    .factory('Movie', ['$http', 'OmdbService', 'TmdbService', function ($http, OmdbService, TmdbService) {

        /**
         * Constructor
         */
        function Movie(release) {
            // Movie info (will be updated from metadata
            this.title = release.title;
            this.year = release.year;

            // Meta data to be filled later
            this.genres = '';
            this.plot = '';

            // Manage release list
            this.releases = [];
            this.latestRelease = undefined;
            this.addRelease(release);
        }

        Movie.prototype.addRelease = function(release) {

            // Grab meta data from release if needed
            if (!angular.isNullOrWhitespace(release.imdbId) && angular.isNullOrWhitespace(this.imdbId))
                this.imdbId = release.imdbId;
            if (!angular.isNullOrWhitespace(release.posterImage) && angular.isNullOrWhitespace(this.posterImage))
                this.posterImage = release.posterImage;

            // Check if a similar release already exists
            var alreadyHasQuality = this.releases.some(function (existingRelease) {
                return existingRelease.quality == release.quality;
            });

            if (alreadyHasQuality)
                return;

            // Add release
            this.releases.push(release);

            // Sort releases by date
            this.releases.sort(function(a, b) { return b.date - a.date; });
            this.latestRelease = this.releases[0];

            // Sort releases by quality
            this.releases.sort(function(a, b) { return b.qualityIndex - a.qualityIndex; });
        };

        Movie.prototype.lookupMetaData = function () {

            // Lookup movie meta data
            var $this = this;

            $this.loading = true;
            TmdbService.populateMovie($this).then(function() {
                OmdbService.populateMovie($this).then(function() {
                    $this.loading = false;
                });
            });
        };

        /**
         * Public methods
         */
        Movie.prototype.getImdbRating = function () {
            return !angular.isNullOrWhitespace(this.imdbRating) ? this.imdbRating : '-';
        };

        Movie.prototype.getTomatoMeter = function () {
            return !angular.isNullOrWhitespace(this.tomatoMeter) ? this.tomatoMeter : '-';
        };

        Movie.prototype.getImdbRatingNormalised = function () {
            return angular.isNullOrWhitespace(this.imdbRating) ? 0 : parseInt(this.imdbRating) * 10;
        };

        Movie.prototype.getTomatoMeterNormalised = function () {
            return angular.isNullOrWhitespace(this.tomatoMeter) ? 0 : parseInt(this.tomatoMeter);
        };

        Movie.prototype.getHighestRating = function () {
            return Math.max(this.getImdbRatingNormalised(), this.getTomatoMeterNormalised());
        };

        Movie.prototype.getImdbStyle = function () {
            return ratingToStyle(this.getImdbRatingNormalised());
        };

        Movie.prototype.getTomatoStyle = function () {
            return ratingToStyle(this.getTomatoMeterNormalised());
        };

        Movie.prototype.getImdbLink = function () {
            return 'http://www.imdb.com/title/' + encodeURIComponent(this.imdbId) + '/';
        };

        Movie.prototype.getTomatoLink = function () {
            return 'http://www.rottentomatoes.com/search/?search=' + encodeURIComponent(this.title);
        };

        Movie.prototype.getPosterTooltip = function () {
            var tooltip = '';

            if (!angular.isNullOrWhitespace(this.tomatoMeter))
                tooltip += '<p>RT: ' + this.tomatoMeter + '% - ' + this.tomatoReviews + ' critics</p>';

            if (!angular.isNullOrWhitespace(this.imdbRating))
                tooltip += '<p>IMDb: ' + this.imdbRating + ' - ' + this.imdbVotes + ' viewers</p>';

            if (!angular.isNullOrWhitespace(this.tomatoConsensus))
                tooltip += '<p>' + this.tomatoConsensus + '</p>';

            return tooltip;
        };

        /**
         * Private functions
         */
        function ratingToStyle(rating) {
            if (rating >= 70)
                return 'rating-green';
            if (rating >= 50)
                return 'rating-orange';

            return 'rating-red';
        }

        /**
         * Return the constructor function
         */
        return Movie;
    }])
;