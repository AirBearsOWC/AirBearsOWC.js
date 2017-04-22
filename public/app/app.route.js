﻿(function () {
    "use strict";

    angular
        .module("app")
        .config(configureRoutes);

    configureRoutes.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];

    function configureRoutes($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("root", {
                template: "<shell></shell>",
                abstract: true
            })
            .state("root.home", {
                url: "/",
                template: "<home></home>"
            })
            .state("root.register-pilot", {
                abstract: true,
                templateUrl: "app/registration/pilot-registration-shell.html",
            })
            .state("root.register-pilot.registration", {
                url: "/register-pilot",
                templateUrl: "app/registration/register-pilot.html",
                controller: "RegisterPilotController as vm"
            })
            .state("root.register-pilot.confirmation", {
                url: "/register-pilot-confirmation",
                templateUrl: "app/registration/pilot-confirmation.html",
                controller: "PilotConfirmationController as vm",
                params: {
                    user: null
                }
            })
            .state("root.register-authority", {
                abstract: true,
                templateUrl: "app/registration/authority-registration-shell.html"
            })
            .state("root.register-authority.registration", {
                url: "/register-authority",
                templateUrl: "app/registration/register-authority.html",
                controller: "RegisterAuthorityController as vm"
            })
            .state("root.register-authority.confirmation", {
                url: "/register-authority-confirmation",
                templateUrl: "app/registration/authority-confirmation.html",
                controller: "AuthorityConfirmationController as vm",
                params: {
                    user: null
                }
            })
            .state("root.privacy-policy", {
                url: "/privacy",
                template: "<privacy></privacy>",
            })
            .state("root.terms-of-service", {
                 url: "/terms",
                 template: "<terms></terms>",
            })
            .state("root.refund-policy", {
                url: "/refund",
                template: "<refund></refund>",
            })
            .state("root.contact", {
                url: "/contact",
                template: "<contact></contact>",
            })
            .state("root.guidelines", {
                url: "/guidelines",
                template: "<guidelines></guidelines>",
            })
            .state("root.resources", {
                url: "/resources",
                templateUrl: "app/resources/resources.html",
                controller: "ResourcesController as vm"
            })
            .state("root.pilot-search", {
                url: "/pilot-search",
                templateUrl: "app/pilot-search/pilot-search.html",
                controller: "PilotSearchController as vm"
            })
            .state("root.reset-password", {
                url: "/reset-password?code",
                templateUrl: "app/reset-password/reset-password.html",
                controller: "ResetPasswordController as vm"
            })
            .state("root.edit-profile", {
                url: "/profile/edit",
                templateUrl: "app/profile/edit-profile.html",
                controller: "EditProfileController as vm"
            })
            .state("root.profile", {
                url: "/profile/:pilotId",
                templateUrl: "app/profile/profile.html",
                controller: "ProfileController as vm",
                params: {
                    pilot: null
                }
            })
            .state("root.post-archive", {
                url: "/posts",
                template: "<post-archive></post-archive>"
            })
            .state("root.post", {
                url: "/posts/:slug",
                template: "<post></post>"
            })
            .state("root.manage-posts", {
                url: "/manage-posts",
                templateUrl: "app/manage/manage-posts.html",
                controller: "ManagePostsController as vm"
            })
            .state("root.edit-post", {
                url: "/manage-posts/:postId",
                templateUrl: "app/manage/edit-post.html",
                controller: "EditPostController as vm"
            })
            .state("root.prepaid-registration", {
                url: "/prepaid-registration",
                templateUrl: "app/manage/prepaid-registration.html",
                controller: "PrepaidRegistrationController as vm"
            })
            .state("root.manage-pilots", {
                url: "/manage-pilots",
                templateUrl: "app/manage/manage-pilots.html",
                controller: "ManagePilotsController as vm"
            })
            .state("root.manage-commanders", {
                url: "/manage-commanders",
                templateUrl: "app/manage/manage-commanders.html",
                controller: "ManageCommandersController as vm"
            });
    }
})();