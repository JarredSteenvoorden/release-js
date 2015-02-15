'use strict';

/*
 Release Log
 Sceper
 Scene Source
 http://www.rlsbb.com/category/movies/

 predb.me
 pre.corrupt-net.org
 pre.corrupt-net.org/live.php (live pre)
 trace.corrupt-net.org (tracer)
 trace.corrupt-net.org/live.php?spam=2 (live tracer)
 pre.zenet.org (live pre)
 tracers.zenet.org (live tracer) 9/18/13
 doopes.com
 prelist.ws
 rlzlog.info
 orlydb.com
 layer13.it.cx/browse
 d00per.com
 nfoogle.com 9/17/13
 m2v.ru 9/18/13
 nfohump.com 4/23/14
 swenews.info (predb/tracer) (swedish) 12/20/12
 dupefr.com (predb) (french) 12/28/13

 xrel.to (rls db) (german) 2/3/13
 xrel.to/p2p/releases.html (p2p rls db) (german) 2/3/13

 vcdq.com (movie/etc rls db + forum) 8/19/13

 hdrls.com (hd movies/tv rls db) 9/18/13

 nfodb.ru | nfodb.net.ru | irc (music rls db) 9/18/13

 leaksallday.com | twitter (music leak db) 9/19/13

 abgx.net (console scene rls db) 9/18/13
 nforush.net | twitter | facebook (console scene rls db) 9/5/13
 renascene.com | twitter | facebook (psp scene rls db) 7/30/13
 logic-sunrise.com (console scene rls db) (french) 9/18/13

 xbins.org (xbox dashboard rls db) 9/17/13
 */

angular.module('app.shared')
    .factory('FeedService', ['$resource', function($resource) {
        return {
            load : function(url, success, failure) {
                return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
                    fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK', num: 50, q: url} }
                })
                .fetch({}, {}, success, failure);
            }
        }
    }]);
