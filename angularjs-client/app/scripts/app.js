'use strict';

(function () {

    angular.module('ticketApp', [ 'ngRoute' ]);

    function initializeKeycloak() {
        var keycloakConfig = {
            "url": "http://" + ENV.rhsso_host + ":" + ENV.rhsso_port + "/auth",
            "realm": ENV.rhsso_realm,
            "clientId": ENV.rhsso_clientId,
            "credentials": {
                "secret": ENV.rhsso_secret
            }
        };
        var keycloak = Keycloak(keycloakConfig);
        keycloak.init({
            onLoad: 'login-required'
        }).success(function () {
            keycloak.loadUserInfo().success(function (userInfo) {
                bootstrapAngular(keycloak, userInfo);
            });
        });
    }

    function bootstrapAngular(keycloak, userInfo) {
      angular
        .module('ticketApp')
        .factory("util", function () {
            return {
                getKieServerUrl: function() {
                    return "http://" + ENV.kieserver_host + ":" + ENV.kieserver_port;
                },
                getTicketAppContainer: function() {
                    return ENV.kieserver_containerId;
                },
                getTicketProcess: function() {
                    return ENV.kieserver_processId;
                }
            }
         })        
        .run(function ($rootScope, $http, $interval) {
            var updateTokenInterval = $interval(function () {
                // refresh token if it's valid for less then 15 minutes
                keycloak.updateToken(15)
                    .success(function (refreshed) {
                        if (refreshed) {
                            $rootScope.token = keycloak.token;
                        }
                    });
            }, 30000);

            $rootScope.token = keycloak.token;
            $rootScope.state={};

            $rootScope.userLogout = function () {
                $rootScope.token="";
                $interval.cancel(updateTokenInterval);
                keycloak.logout();
            };

            $rootScope.currentUser = {
                username: userInfo.name || userInfo.preferred_username,
                roles: keycloak.realmAccess.roles
            };
        })
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'mainCtrl',
                    controllerAs: 'main'
                })
                .when('/createTicket', {
                    templateUrl: 'views/createTicket.html',
                    controller: 'createTicketCtrl',
                    controllerAs: 'create'
                })
                .when('/myTickets', {
                    templateUrl: 'views/myTickets.html',
                    controller: 'myTicketsCtrl',
                    controllerAs: 'mytickets'
                })
                .when('/ticket', {
                    templateUrl: 'views/ticket.html',
                    controller: 'ticketCtrl',
                    controllerAs: 'ticket'                    
                })
                .otherwise({
                    redirectTo: '/'
                });
            })
        .service('sharedStateService', function () {
            var currentTask;

            var getCurrentTask = function () {
                return currentTask;
            }

            var setCurrentTask = function (id) {
                currentTask = id;
            }

            return {
                getCurrentTask: getCurrentTask,
                setCurrentTask: setCurrentTask
            };
        });

        angular.bootstrap(document, ['ticketApp']);     
    }

    initializeKeycloak();


}());
