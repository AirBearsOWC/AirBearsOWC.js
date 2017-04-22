﻿(function () {
    "use strict";

    angular
        .module("app")
        .factory("authService", authService);

    authService.$inject = ["$rootScope", "$state", "$http", "$uibModal", "store"];

    function authService($rootScope, $state, $http, $uibModal, store) {
        var service = {};
        var urlBase = "/api/";

        service.authenticate = authenticate;
        service.logout = logout;
        service.getAuthToken = getAuthToken;
        service.onLogin = onLogin;
        service.onUnauthenticated = onUnauthenticated;
        service.openLogin = openLogin;

        return service;

        function openLogin(callback, requireLogin) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "app/auth/login-modal.html",
                controller: "LoginModalController as vm",
                size: "sm"
            });

            modalInstance.result.then(function (result) {
                if (callback) { callback(result); }
            }, function () {
                if (requireLogin) { $state.go("root.home"); }
            });
        }

        function authenticate(email, password) {
            return $http.post(urlBase + "token", { email: email, password: password })
                .success(function (resp) {
                    $rootScope.$broadcast("LOG_IN");
                    store.set("auth_token", resp.token);
                }).error(function (resp) {
                    return resp;
                });
        }

        function logout() {
            store.remove("auth_token");
        }

        function getAuthToken() {
            return store.get("auth_token");
        }

        function onLogin(scope, callback) {
            var handler = $rootScope.$on("LOG_IN", callback);
            scope.$on("$destroy", handler);
        }

        function onUnauthenticated(scope, callback) {
            var handler = $rootScope.$on("UNAUTHENTICATED", callback);
            scope.$on("$destroy", handler);
        }
    }
})();