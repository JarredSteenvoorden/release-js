'use strict';

angular.module('app.shared')
    .factory('ReleaseLogFeed', ['FeedService', 'Movie', function(FeedService, Movie) {
        var feedUrl = 'http://www.rlslog.net/category/movies/feed';

        return {
            load : function(success) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var movies = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {

                        // Ignore ads
                        if (feedEntry.link.indexOf('free-download') >= 0)
                            return;

                        // Create movie object from rss
                        var movie = new Movie(
                            feedEntry.title
                        );

                        // Match <img src="somthing.jpg" /> to extract the poster
                        var regexResult = /(^|.*)(img.*src=")(.*?)("[\s\S]*|$)/.exec(feedEntry.content);
                        if (regexResult && regexResult.length == 5)
                            movie.posterImage = regexResult[3];

                        this.push(movie);
                    }, movies);

                    success(movies);
                })
            }
        }
    }]);
