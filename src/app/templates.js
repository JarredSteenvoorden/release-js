angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('admin.html',
    "<p>Shhhhhhhh!</p>"
  );


  $templateCache.put('main.html',
    "<div class=movie-list><div class=movie ng-repeat=\"movie in movies\"><div class=pull-left bs-tooltip=movie.getPosterTooltip()><div class=movie-poster ng-class=\"{'movie-poster-none': !movie.posterImage}\" ng-style=\"movie.posterImage ? {'background-image': 'url(' + movie.posterImage + ')'} : {}\"></div><div class=movie-ratings><div class=\"movie-rating {{movie.getTomatoStyle()}}\">{{movie.getTomatoMeter()}}</div><div class=\"movie-rating {{movie.getImdbStyle()}}\">{{movie.getImdbRating()}}</div></div></div><div><div class=movie-title>{{movie.title}}</div><div class=movie-info>{{movie.year}} - {{movie.genres}}</div><div class=movie-plot>{{movie.plot}}</div></div><div class=movie-quality>{{movie.getQuality()}}</div></div></div>"
  );

}]);
