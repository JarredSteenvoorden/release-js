'use strict';

angular.module('app.feed-item', ['ui.router'])

    .config(function config($stateProvider) {
        $stateProvider.state('feed-item', {
            url: '/test',
            controller: 'FeedItemController',
            templateUrl: 'app/views/feed-item/feed-item.tpl.html'
        });
    })

    .controller('FeedItemController', function($scope) {
        $scope.title = '';
    })
;