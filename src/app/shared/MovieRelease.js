'use strict';
//https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc

angular.module('app.shared')
    .factory('MovieRelease', [ function () {

        // Quality descriptions
        //http://www.thenerdmachine.com/community/topic/10851-the-all-formats-bible-guide/
        MovieRelease.possibleQualities = ['1080p', '720p', '480p', 'WEBRip', 'WEB-DL', 'BRRip', 'BDRip', 'HDRip', 'DVDRip', 'DVDScr', 'HDTV', 'TS', 'TELESYNC', 'R6', 'CAMRip', 'Cam'];

        /**
         * Constructor
         */
        function MovieRelease(name, date) {
            var $this = this;

            this.name = name;
            this.date = date;

            // Properties parsed from name
            this.title = '';
            this.year = '';
            this.quality = 'unknown';
            this.qualityIndex = 100;
            this.group = '';
            this.searchQuery = '';

            // Meta data that may be provided by feeds
            this.imdbId = '';
            this.posterImage = '';

            // Parse the release string
            var regexResult = /(^|.*)( \d{4} )(.*)-(.*|$)/.exec(name);
            if (regexResult && regexResult.length == 5) {
                // Title and year always first, group always last
                this.title = regexResult[1].trim();
                this.year = regexResult[2].trim();
                this.group = regexResult[4].trim();

                // Middle contains other details
                var extraInfo = regexResult[3].trim();

                // Extract quality from white list
                MovieRelease.possibleQualities.some(function (quality, index) {
                    var searchRegExp = new RegExp(quality, 'i');
                    if (extraInfo.search(searchRegExp) >= 0) {
                        $this.quality = quality;
                        $this.qualityIndex = index;
                        return true;
                    }
                });
            }

            this.searchQuery = this.title + ' ' + this.year;
            if (this.quality != 'unknown') {
                this.searchQuery += ' ' + this.quality;
            }
        }

        return MovieRelease;
    }])
;