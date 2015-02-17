'use strict';

angular.module('app', [
        // Vendor
        'ngResource',               // Rest resource requests
        'angular-data.DSCacheFactory',
        'ngSanitize',

        'ui.router',                // UI Router
        'mgcrea.ngStrap',           // Bootstrap UI
        'ngAnimate',                // Smooth animations

        // Shared
        'app.shared',

        // Pages
        'app.pages'
    ])

    // Configure router
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise( '/main' );
    }])

    .config(['$tooltipProvider', function($tooltipProvider) {
        angular.extend($tooltipProvider.defaults, {
            animation: 'am-fade-and-scale',
            placement: 'right',
            html: true,
            delay: '200'
        })
    }])

    // Main App Controller
    .controller('AppController', ['$scope', function($scope) {

    }])
;

angular.module('app.pages', ['ui.router']);
angular.module('app.shared', ['ui.router']);

angular.isUndefinedOrNull = function(value) {
    return angular.isUndefined(value) || value === null
};

angular.isNullOrWhitespace = function(value) {
    if (angular.isUndefinedOrNull(value))
        return true;

    return value.replace(/\s/g, '').length < 1;
};
