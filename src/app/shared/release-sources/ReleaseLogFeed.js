'use strict';

angular.module('app.shared')
    .factory('ReleaseLogFeed', function(FeedService, Movie) {
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

                        this.push(movie);
                    }, movies);

                    success(movies);
                })
            }
        }
    })
;
