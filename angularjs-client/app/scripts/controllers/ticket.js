'use strict';

angular.module('ticketApp')
    .controller('ticketCtrl', function ($scope, $http, $location, util, sharedStateService) {

        $scope.data = {};

        $scope.getTask = function (id) {
            var url = util.getKieServerUrl() 
                + "/kie-server/services/rest/server/containers/"
                + util.getTicketAppContainer()
                + "/tasks/"
                + id
                + "?withInputData=true&withOutputData=true";

            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
            $http.defaults.headers.common['Accept'] = "application/json";  
            $http.get(url)
                .success(function (data) {
                    $scope.data.task = data;
                })
                .error(function (error) {
                    $scope.data.error = {};
                    $scope.data.error.code = 'ticket';
                    $scope.data.error.message = 'The ticket with id ' + id + ' could not be retrieved.'
                });
        };

        $scope.saveTask = function (task) {

            var url = util.getKieServerUrl() 
                + "/kie-server/services/rest/server/containers/"
                + util.getTicketAppContainer()
                + "/tasks/"
                + task["task-id"]
                + "/contents/output";

            var outputData = {
                comments : task['task-output-data']['comments']
            }

            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
            $http.defaults.headers.common['Accept'] = "application/json";
            $http.defaults.headers.common['Content-type'] = "application/json";
            $http.put(url, outputData)
                .success(function (data) {
                    
                })
                .error(function (error) {
                    $scope.data.error = {};
                    $scope.data.error.code = 'saveTask';
                    $scope.data.error.message = 'The task could not be saved.'
                })
        }

        $scope.completeTask = function (task) {

            var url = util.getKieServerUrl() 
                + "/kie-server/services/rest/server/containers/"
                + util.getTicketAppContainer()
                + "/tasks/"
                + task["task-id"]
                + "/states/completed";

            var outputData = {
                comments : task['task-output-data']['comments']
            }

            $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
            $http.defaults.headers.common['Accept'] = "application/json";
            $http.defaults.headers.common['Content-type'] = "application/json";
            $http.put(url, outputData)
                .success(function (data) {
                    sharedStateService.setCurrentTask((function () {return;})());
                    $location.path("/myTickets");

                })
                .error(function (error) {
                    $scope.data.error = {};
                    $scope.data.error.code = 'completeTask';
                    $scope.data.error.message = 'The task could not be completed.'
                })
        }

        if (sharedStateService.getCurrentTask()) {
            $scope.getTask(sharedStateService.getCurrentTask());
        }

    });