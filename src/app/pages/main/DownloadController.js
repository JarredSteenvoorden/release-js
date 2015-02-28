'use strict';

angular.module('app.pages')
    .controller('DownloadController', ['$scope', '$sce', function($scope, $sce) {
        $scope.movie = $scope.$parent.$parent.movie;

        var searchQuery = encodeURIComponent($scope.movie.releaseSearch);

        $scope.kickassSearchUrl = "https://kickass.to/usearch/" + searchQuery;
        $scope.extraTorrentUrl = "http://extratorrent.cc/search/?search=" + searchQuery;
        $scope.dogNzbUrl = "http://dognzb.cr/search/" + searchQuery;
        $scope.nzbClubUrl = "http://www.nzbclub.com/search.aspx?q=" + searchQuery;

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.shownSite = 0;
        $scope.showSite = function(number) {
            $scope.shownSite = number;
        };
    }])
;
