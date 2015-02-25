angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('admin.html',
    "<p>Shhhhhhhh!</p>"
  );


  $templateCache.put('download_modal.html',
    "<div class=modal tabindex=-1 role=dialog><div class=\"modal-lg modal-dialog\" ng-controller=DownloadController><div class=modal-content><div class=\"modal-header clearfix\"><div class=\"modal-close fa fa-times\" ng-click=$hide()></div><h4 class=modal-title>{{movie.title}} ({{movie.year}})</h4><div class=clear></div></div><div class=modal-body><div class=download-site ng-click=showSite(0)><i class=\"fa fa-cloud-download\"></i> kickass</div><div class=download-site ng-click=showSite(1)><i class=\"fa fa-cloud-download\"></i> extra torrent</div><div class=download-site ng-click=showSite(2)><i class=\"fa fa-cloud-download\"></i> dognzb</div><div class=download-site ng-click=showSite(3)><i class=\"fa fa-cloud-download\"></i> nzb club</div><div class=clear></div><iframe ng-show=\"shownSite == 0\" class=download-iframe ng-src={{trustSrc(kickassSearchUrl)}}></iframe><iframe ng-show=\"shownSite == 1\" class=download-iframe ng-src={{trustSrc(extraTorrentUrl)}}></iframe><iframe ng-show=\"shownSite == 2\" class=download-iframe ng-src={{trustSrc(dogNzbUrl)}}></iframe><iframe ng-show=\"shownSite == 3\" class=download-iframe ng-src={{trustSrc(nzbClubUrl)}}></iframe></div></div></div></div>"
  );


  $templateCache.put('main.html',
    "<div class=movie-list><div class=movie ng-repeat=\"movie in movies\"><div class=movie-container-left ng-click=\"playTrailer(movie, $event)\"><div class=movie-poster ng-class=\"{'movie-poster-none': !movie.posterImage}\" ng-style=\"movie.posterImage ? {'background-image': 'url(' + movie.posterImage + ')'} : {}\"></div><i class=\"movie-trailer-button fa fa-youtube-play\"></i></div><div class=movie-container-right><div class=movie-title>{{movie.title}}</div><div class=movie-info>{{movie.year}} - {{movie.genres}}</div><div class=movie-plot>{{movie.plot}}</div></div><div class=movie-ratings bs-tooltip=movie.getPosterTooltip()><a class=movie-rating ng-class=movie.getTomatoStyle() ng-href={{movie.getTomatoLink()}} target=_blank>{{movie.getTomatoMeter()}}</a> <a class=movie-rating ng-class=movie.getImdbStyle() ng-href={{movie.getImdbLink()}} target=_blank>{{movie.getImdbRating()}}</a></div><div class=movie-quality ng-click=showDownloadModal(movie)><i class=\"fa fa-cloud-download\"></i> {{movie.getQuality()}}</div><div class=movie-trailer-container><div class=movie-trailer-header><div class=movie-trailer-title>{{movie.title}} ({{movie.year}})</div><i class=\"movie-trailer-close fa fa-times\" ng-click=closeTrailers()></i></div></div></div></div>"
  );

}]);
