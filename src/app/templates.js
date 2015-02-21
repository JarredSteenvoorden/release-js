angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('admin.html',
    "<p>Shhhhhhhh!</p>"
  );


  $templateCache.put('main.html',
    "<div class=movie-list><div class=movie ng-repeat=\"movie in movies\"><div class=movie-container-left><div class=movie-poster ng-class=\"{'movie-poster-none': !movie.posterImage}\" ng-style=\"movie.posterImage ? {'background-image': 'url(' + movie.posterImage + ')'} : {}\"></div></div><div class=movie-container-right><div class=movie-title>{{movie.title}}</div><div class=movie-info>{{movie.year}} - {{movie.genres}}</div><div class=movie-plot>{{movie.plot}}</div></div><div class=movie-ratings bs-tooltip=movie.getPosterTooltip()><a class=movie-rating ng-class=movie.getTomatoStyle() ng-href={{movie.getTomatoLink()}} target=_blank>{{movie.getTomatoMeter()}}</a> <a class=movie-rating ng-class=movie.getImdbStyle() ng-href={{movie.getImdbLink()}} target=_blank>{{movie.getImdbRating()}}</a></div><div class=movie-quality>{{movie.getQuality()}}</div></div></div>"
  );

}]);
