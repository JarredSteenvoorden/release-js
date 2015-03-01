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

    // Modal display options
    .config(['$modalProvider', function($modalProvider) {
        angular.extend($modalProvider.defaults, {
            animation: 'am-fade',
            backdropAnimation: 'am-fade',
            placement: 'center'
        });
    }])

    .config(['$tooltipProvider', function($tooltipProvider) {
        angular.extend($tooltipProvider.defaults, {
            animation: 'am-fade-and-scale',
            placement: 'top',
            html: true,
            delay: '200'
        })
    }])

    // Main App Controller
    .controller('AppController', ['$scope', function($scope) {
        $scope.refresh = function() {
            window.location.reload(false);
        }
    }])
;

angular.module('app.pages', ['ui.router']);
angular.module('app.shared', ['ui.router']);

angular.isUndefinedOrNull = function(value) {
    return angular.isUndefined(value) || value === null
};

angular.isNullOrWhitespace = function(value) {
    // Undefined or null
    if (angular.isUndefinedOrNull(value))
        return true;

    // Unexpected type (not a string)
    if (typeof value != 'string' && !(value instanceof String))
        return true;

    return value.replace(/\s/g, '').length < 1;
};
