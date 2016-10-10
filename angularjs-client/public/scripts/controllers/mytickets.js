'use strict';

angular.module('ticketApp')
    .controller('myTicketsCtrl', function ($scope, $http, $location, sharedStateService) {
    
        $scope.data = {};

        $scope.data.page = 0;

        $scope.getMyTickets = function(page) {

            if (page < 0) {
                page = 0;
            }

            $scope.data.page = page;

            var url = "/api/mytickets"
                + "?page=" + page;

            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
            $http.get(url)
                .success(function (data) {
                    $scope.data.result = data['task-summary'];
                })
                .error(function (error) {
                    $scope.data.error = {};
                    $scope.data.error.code = 'getMyTickets';
                    $scope.data.error.message = 'The ticket list could not be retrieved.'
                });

        };

        $scope.processTicket = function (id, op) {
            var url = "/api/tickets/"
                + id
                + "/states/"
                + op;

            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
            $http.put(url)
                .success(function (data) {
                    $scope.getMyTickets($scope.data.page);
                })
                .error(function (error) {
                    $scope.data.error = {};
                    $scope.data.error.code = op;
                    $scope.data.error.message = 'Error when performing operation ' + op + ' on task ' + id + '.';
                });

        };

        $scope.viewTicket = function (id) {
            sharedStateService.setCurrentTask(id);
            $location.path("/ticket");
        }

        $scope.getMyTickets(0)    

    })
    .filter('description', function() {
        return function (data, propertyName) {
            switch (propertyName) {
                case "project":
                    return data.split("::")[0];
                    break;
                case "subject":
                    return data.split("::")[1];
                    break;
                default:
                    return data;
            }
        }
    });
