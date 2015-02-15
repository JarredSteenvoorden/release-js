'use strict';

angular.module('app.shared')
    .factory('SceneSourceFeed', function(FeedService, Movie) {
        var feedUrl = 'http://www.scnsrc.me/category/films/feed';

        return {
            load : function(success) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var movies = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {

                        // Exclude stray tv results
                        if (/(^|.*)(S\d{2}E\d{2})(.*|$)/.test(feedEntry.title))
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
