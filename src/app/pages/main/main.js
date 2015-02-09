'use strict';
//http://cacodaemon.de/index.php?id=51

angular.module('app.main', ['ui.router'])

    .config(function config($stateProvider) {
        $stateProvider.state( 'main', {
            url: '/main',
            controller: 'MainController',
            templateUrl: 'app/pages/main/main.tpl.html'
        });
    })

    .controller('MainController', function($scope, FeedService) {
        $scope.result = '';

        FeedService.load('http://www.rlslog.net/category/tv-shows/feed', function (data) { //lookup title
            $scope.result = data.responseData.feed.entries.length;
        });
    })
;
