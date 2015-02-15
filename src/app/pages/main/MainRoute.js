'use strict';

angular.module('app.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state( 'main', {
            url: '/main',
            controller: 'MainController',
            templateUrl: 'main.html'
        });
    }])
;
