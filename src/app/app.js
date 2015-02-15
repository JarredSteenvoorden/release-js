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
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise( '/main' );
    })

    .config(function($tooltipProvider) {
        angular.extend($tooltipProvider.defaults, {
            animation: 'am-flip-x',
            placement: 'right',
            html: true
        })
    })

    // Main App Controller
    .controller('AppController', function($scope) {

    })
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
}

// Helper functions used for locating URL of the executing script
// See page routes to see how they are used to locate template files
var scriptPaths = [];
function registerScriptPath() {
    var scripts = document.getElementsByTagName('script');
    var fullFileName = scripts[scripts.length-1].src;
    var directory = fullFileName.substring(0, fullFileName.lastIndexOf('/'));
    var fileName = fullFileName.substring(fullFileName.lastIndexOf('/') + 1);

    if (!(fileName in scriptPaths))
        scriptPaths[fileName] = directory;
    else
        alert("The script '" + fileName + "' is registered in multiple paths.\n" + scriptPaths[fileName] + "\n" + directory);
}

function getScriptPath(fileName) {
    if (fileName in scriptPaths)
        return scriptPaths[fileName];

    alert("The script '" + fileName + "' has no registered directory.")
}