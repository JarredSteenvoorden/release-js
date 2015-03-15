'use strict';
//http://cacodaemon.de/index.php?id=51

angular.module('app.pages')
    .controller('MainController', ['$scope', '$modal', 'MovieList', function($scope, $modal, MovieList) {

        $scope.search = '';

        $scope.minimumRatings = [
            { display: 'No minimum', filter: 0 },
            { display: 'At least 5.0', filter: 50 },
            { display: 'At least 7.0', filter: 70 }
        ];
        $scope.selectedMinimumRating = $scope.minimumRatings[0];

        $scope.genres = [
            { display: 'All Genres', filter: '' },
            { display: 'Action', filter: 'action' },
            { display: 'Adventure', filter: 'adventure' },
            { display: 'Animation', filter: 'animation' },
            { display: 'Comedy', filter: 'comedy' },
            { display: 'Drama', filter: 'drama' },
            { display: 'Sci-Fi', filter: 'sci-fi' },
            { display: 'Horror', filter: 'horror' },
            { display: 'Thriller', filter: 'thriller' }
        ];
        $scope.selectedGenre = $scope.genres[0];

        $scope.movies = MovieList.movies;
        MovieList.load();

        var minimumRatingModal = $modal({scope: $scope, template: 'rating_modal.html', show: false});
        $scope.showMinimumRatingModal = function() {
            minimumRatingModal.$promise.then(minimumRatingModal.show);
        };

        $scope.selectMinimumRating = function(minimumRating) {
            $scope.selectedMinimumRating = minimumRating;
            minimumRatingModal.hide();
        };

        var genreModal = $modal({scope: $scope, template: 'genre_modal.html', show: false});
        $scope.showGenreModal = function() {
            genreModal.$promise.then(genreModal.show);
        };

        $scope.selectGenre = function(genre) {
            $scope.selectedGenre = genre;
            genreModal.hide();
        };

        $scope.searchFilter = function(movie) {
            if ($scope.search.length == 0)
                return true;

            var searchRegExp = new RegExp($scope.search, 'i');

            return movie.title.search(searchRegExp) >= 0 ||
                movie.genres.search(searchRegExp) >= 0
            ;
        };

        $scope.minimumScoreFilter = function (movie) {
            return movie.getHighestRating() >= $scope.selectedMinimumRating.filter;
        };

        $scope.closeTrailers = function() {
            angular.element(document.querySelectorAll('.movie-trailer-container')).hide();
            angular.element(document.querySelector('.movie-trailer')).remove();
        };

        $scope.playTrailer = function(movie, event) {
            // Remove existing trailers from page
            var movieElement = angular.element(event.currentTarget).closest('.movie');
            var trailerContainer = angular.element(movieElement[0].querySelector('.movie-trailer-container'));

            // Close existing trailer
            $scope.closeTrailers();
            trailerContainer.show();

            // Search youtube for trailer
            var searchQuery = movie.title + ' ' + movie.year + ' trailer';
            var request = gapi.client.youtube.search.list({
                q: searchQuery,
                part: 'snippet',
                type: 'video',
                videoEmbeddable: 'true',
                maxResults: 1
            });

            request.execute(function(response) {
                // Embed and play first result
                var searchResults = response.result.items;
                if (searchResults.length > 0)
                {
                    var videoId = searchResults[0].id.videoId;
                    trailerContainer.prepend('<iframe class="movie-trailer" type="text/html" src="http://www.youtube.com/embed/' + videoId + '?autoplay=1&fs=1&rel=0&showinfo=0&modestbranding=1" frameborder="0" allowfullscreen></iframe>');
                }
            });
        };

        $scope.showDownloadModal = function(release) {
            var scope = $scope.$new();
            scope.release = release;
            var downloadModal = $modal({scope: scope, template: 'download_modal.html', show: false});

            downloadModal.$promise.then(downloadModal.show);
        };
    }])
;
