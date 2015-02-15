'use strict';

angular.module('app.pages')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state( 'admin', {
            url: '/admin',
            controller: 'AdminController',
            templateUrl: 'admin.html'
        });
    }])
;
