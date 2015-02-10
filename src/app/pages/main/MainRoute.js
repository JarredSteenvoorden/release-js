'use strict';
registerScriptPath();

angular.module('app.pages')
    .config(function config($stateProvider) {
        $stateProvider.state( 'main', {
            url: '/main',
            controller: 'MainController',
            templateUrl: getScriptPath('MainRoute.js') + '/main.html'
        });
    })
;
