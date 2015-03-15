// Releases BB
// http://www.rlsbb.com

'use strict';

angular.module('app.shared')
    .factory('ReleasesBbFeed', ['FeedService', 'MovieRelease', function(FeedService, MovieRelease) {
        var feedUrl = 'http://www.rlsbb.com/category/movies/feed';

        return {
            load : function(complete) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var releases = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {

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
