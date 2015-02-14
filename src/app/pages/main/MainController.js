'use strict';
//http://cacodaemon.de/index.php?id=51

angular.module('app.pages')
    .controller('MainController', function($scope, ReleaseLogReader) {
        $scope.movies = [];

        ReleaseLogReader.load(function (movies) {
            $scope.movies = movies;
        });
    })
;
