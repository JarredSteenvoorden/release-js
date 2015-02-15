'use strict';

angular.module('app.shared')
    .factory('ReleasesBbFeed', function(FeedService, Movie) {
        var feedUrl = 'http://www.rlsbb.com/category/movies/feed';

        return {
            load : function(success) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var movies = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {
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
