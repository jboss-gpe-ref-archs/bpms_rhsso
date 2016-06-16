'use strict';

angular.module('ticketApp')
    .controller('createTicketCtrl', function ($scope, $http, $location, util) {

        $scope.data = {};

        $scope.createTicket = function(ticket) {
            var url = util.getKieServerUrl() 
                + "/kie-server/services/rest/server/containers/"
                + util.getTicketAppContainer()
                + "/processes/"
                + util.getTicketProcess()
                + "/instances";

            var ticketVar = {
                project : ticket.project,
                subject : ticket.subject,
                description : ticket.description,
                actors : ticket.actors,
                groups : ticket.groups
            };

            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
            $http.defaults.headers.common['Accept'] = "application/json";
            $http.defaults.headers.common['Content-type'] = "application/json";
            $http.post(url, ticketVar)
                .success(function (data) {
                    $scope.data.result = data;
                })
                .error(function (error) {
                    $scope.data.error = {};
                    $scope.data.error.code = 'createTicket';
                    $scope.data.error.message = 'The ticket could not be created.'
                })
                .finally(function () {
                    $scope.data.ticket = {};
                });
        }

        $scope.reload = function() {
            $scope.data = {};
        }
  });