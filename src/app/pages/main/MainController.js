'use strict';
//http://cacodaemon.de/index.php?id=51

angular.module('app.pages')
    .controller('MainController', function($scope, FeedService, Movie) {
        $scope.result = '';

        FeedService.load('http://www.rlslog.net/category/movies/feed', function (data) { //lookup title
            $scope.result = data.responseData.feed.entries.length;

            var movies = [];
            angular.forEach(data.responseData.feed.entries, function(value, key) {
                this.push(Movie.build(value));
            }, movies);

            $scope.result = movies.length;
        });
    })
;
