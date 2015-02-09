'use strict';

angular.module('app.service', [])
    .service('commonService', function() {
        this.headerTemplate = "";

        var memberName = "";

        this.getBookCount = function() {
            return bookCount;
        };

        this.setBookCount = function(value) {
            bookCount = value;
        };

        this.setHeaderTemplate = function(value) {
            this.headerTemplate = value;
        }

        this.getMemberName = function() {
            return memberName;
        }

        this.setMemberName = function(value) {
            memberName = value;
        }

        this.getSignalRUrl = function() {
            // Check if running from webstorm
            if (document.URL.indexOf(baseUrl) < 0)
                return baseUrl + "/signalr"

            return "signalr";
        }

        this.getApiUrl = function(value) {
            // Check if running from webstorm
            if (document.URL.indexOf(baseUrl) < 0)
                return baseUrl + "/api/" + value;

            return "api/" + value;
        }

        // Private region
        var bookCount = 0;
        var baseUrl = "http://localhost:8743";
    });
