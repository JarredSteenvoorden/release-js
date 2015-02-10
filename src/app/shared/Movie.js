'use strict';
//https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc

angular.module('app.shared')
    .factory('Movie', function () {

        /**
         * Constructor, with class name
         */
        function Movie(firstName, lastName, role, organisation) {
            // Public properties, assigned to the instance ('this')
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
            this.organisation = organisation;
        }

        /**
         * Public method, assigned to prototype
         */
        Movie.prototype.getFullName = function () {
            return this.firstName + ' ' + this.lastName;
        };

        /**
         * Private property
         */
        var possibleRoles = ['admin', 'editor', 'guest'];

        /**
         * Private function
         */
        function checkRole(role) {
            return possibleRoles.indexOf(role) !== -1;
        }

        /**
         * Static property
         * Using copy to prevent modifications to private property
         */
        Movie.possibleRoles = angular.copy(possibleRoles);

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        Movie.build = function (data) {
            if (!checkRole(data.role)) {
                return;
            }
            return new Movie(
                data.first_name,
                data.last_name,
                data.role
            );
        };

        /**
         * Return the constructor function
         */
        return Movie;
    })
;