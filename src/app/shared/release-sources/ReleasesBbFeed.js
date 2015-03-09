// Releases BB
// http://www.rlsbb.com

'use strict';

angular.module('app.shared')
    .factory('ReleasesBbFeed', ['FeedService', 'Movie', function(FeedService, Movie) {
        var feedUrl = 'http://www.rlsbb.com/category/movies/feed';

        return {
            load : function(complete) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var movies = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {

                        // Create movie object from rss
                        var movie = new Movie(feedEntry.title, Date.parse(feedEntry.publishedDate));

                        this.push(movie);
                    }, movies);

                    complete(movies);
                },
                function() {
                    complete([]);
                })
            }
        }
    }]);
