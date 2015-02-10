'use strict';
registerScriptPath();

angular.module('app.pages')
    .config(function config($stateProvider) {
        $stateProvider.state( 'admin', {
            url: '/admin',
            controller: 'AdminController',
            templateUrl: getScriptPath('AdminRoute.js') + '/admin.html'
        });
    })
;
