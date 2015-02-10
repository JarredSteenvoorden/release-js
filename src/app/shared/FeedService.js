'use strict';

angular.module('app.shared')
    .factory('FeedService', function($resource) {
        return {
            load : function(url, success, failure) {
                return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
                    fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK', num: 50, q: url} }
                })
                .fetch({}, {}, success, failure);
            }
        }
    })
;
