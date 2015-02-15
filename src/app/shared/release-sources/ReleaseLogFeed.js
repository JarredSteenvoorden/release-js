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
                        var movie = new Movie(feedEntry.title);

                        // Match <img src="somthing.jpg" /> to extract the poster
                        var posterRegex = /(^|[\s\S]*?)(img.*src=")(.*?)("[\s\S]*|$)/.exec(feedEntry.content);
                        if (posterRegex && posterRegex.length == 5)
                            movie.posterImage = posterRegex[3];

                        // Match http://www.imdb.com/title/tt1109624/ to extract imdbId
                        var imdbRegex = /(^|[\s\S]*?)(www.imdb.com\/title\/)(.*?)(\/|")([\s\S]*|$)/.exec(feedEntry.content);
                        if (imdbRegex && imdbRegex.length == 6)
                            movie.imdbId = imdbRegex[3];

                        this.push(movie);
                    }, movies);

                    success(movies);
                })
            }
        }
    }]);
