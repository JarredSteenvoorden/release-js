'use strict';

angular.module('app', [
        // Vendor
        'ngResource',               // Rest resource requests
        'ui.router',                // UI Router
        'mgcrea.ngStrap',           // Bootstrap UI
        'ngAnimate',                // Smooth animations

        // Shared
        'app.feed-service', 'app.service',

        // Views
        'app.feed-item',

        // Pages
        'app.main'
    ])

    // Configure router
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise( '/main' );
    })

    // Main App Controller
    .controller('AppController', function($scope) {

    })
;