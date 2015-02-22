'use strict';
//http://cacodaemon.de/index.php?id=51

angular.module('app.pages')
    .controller('MainController', ['$scope', 'MovieList', function($scope, MovieList) {
        $scope.movies = MovieList.movies;

        MovieList.load();

        $scope.closeTrailers = function() {
            angular.element(document.querySelectorAll('.movie-trailer-container')).hide();
            angular.element(document.querySelector('.movie-trailer')).remove();
        };

        $scope.playTrailer = function(movie, event) {
            // Remove existing trailers from page
            var movieElement = angular.element(event.currentTarget).closest('.movie');
            var trailerContainer = angular.element(movieElement[0].querySelector('.movie-trailer-container'));

            $scope.closeTrailers();

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
                    trailerContainer.show();
                }
            });
        };
    }])
;
