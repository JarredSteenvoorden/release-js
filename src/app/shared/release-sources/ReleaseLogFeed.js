// Release Log
// http://www.rlslog.net

'use strict';

angular.module('app.shared')
    .factory('ReleaseLogFeed', ['FeedService', 'MovieRelease', function(FeedService, MovieRelease) {
        var feedUrl = 'http://www.rlslog.net/category/movies/feed';

        return {
            load : function(complete) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var releases = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {

                        // Ignore ads
                        if (feedEntry.link.indexOf('free-download') >= 0)
                            return;

                        // Ignore stray games!?
                        if (angular.isArray(feedEntry.categories) && feedEntry.categories.length > 0 &&
                            feedEntry.categories[0].match(/game/i)) {
                            return;
                        }

                        // Create movie object from rss
                        var movieRelease = new MovieRelease(feedEntry.title, Date.parse(feedEntry.publishedDate));

                        // Match <img src="somthing.jpg" /> to extract the poster
                        var posterRegex = /(^|[\s\S]*?)(img.*src=")(.*?)("[\s\S]*|$)/.exec(feedEntry.content);
                        if (posterRegex && posterRegex.length == 5)
                            movieRelease.posterImage = posterRegex[3];

                        // Match http://www.imdb.com/title/tt1109624/ to extract imdbId
                        var imdbRegex = /(^|[\s\S]*?)(www.imdb.com\/title\/)(.*?)(\/|")([\s\S]*|$)/.exec(feedEntry.content);
                        if (imdbRegex && imdbRegex.length == 6)
                            movieRelease.imdbId = imdbRegex[3];

                        this.push(movieRelease);
                    }, releases);

                    complete(releases);
                },
                function() {
                    complete([]);
                })
            }
        }
    }]);
