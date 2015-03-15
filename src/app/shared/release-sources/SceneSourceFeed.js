// Scene Source
// http://www.scnsrc.me

'use strict';

angular.module('app.shared')
    .factory('SceneSourceFeed', ['FeedService', 'MovieRelease', function(FeedService, MovieRelease) {
        var feedUrl = 'http://www.scnsrc.me/category/films/feed';

        return {
            load : function(complete) {
                FeedService.load(feedUrl, function (feedResponse) {
                    var releases = [];
                    angular.forEach(feedResponse.responseData.feed.entries, function (feedEntry) {

                        // Exclude stray tv results
                        if (/(^|.*)(S\d{2}E\d{2})(.*|$)/.test(feedEntry.title))
                            return;

                        // Create movie object from rss
                        var movieRelease = new MovieRelease(feedEntry.title, Date.parse(feedEntry.publishedDate));

                        // Match <img src="somthing.jpg" /> to extract the poster
                        // Scene Source has no image in it's RSS content

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
