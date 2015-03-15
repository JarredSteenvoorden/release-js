// Sceper
// http://sceper.ws/

'use strict';

angular.module('app.shared')
    .factory('SceperFeed', ['FeedService', 'MovieRelease', function(FeedService, MovieRelease) {
        var feedUrl = 'http://sceper.ws/category/movies/feed';

        return {
            load : function(complete) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var releases = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {
                        // Create movie object from rss
                        var movieRelease = new MovieRelease(feedEntry.title, Date.parse(feedEntry.publishedDate));

                        // Match <img src="somthing.jpg" /> to extract the poster
                        // Sceper 403's image links

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
