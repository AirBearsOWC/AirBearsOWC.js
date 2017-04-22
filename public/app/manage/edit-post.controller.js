﻿(function () {
    "use strict";

    angular
        .module("app")
        .controller("EditPostController", EditPostController);

    EditPostController.$inject = ["$stateParams", "$state", "postService", "toast"];

    function EditPostController($stateParams, $state, postService, toast) {
        var vm = this;
        var isNewPost = true;

        vm.publishDatePickerOpened = false;
        vm.slugWarningOverridden = false;

        vm.save = save;
        vm.openPublishDatePicker = openPublishDatePicker;
        vm.generateSlug = generateSlug;
        vm.overrideSlugWarning = overrideSlugWarning;

        activate();

        function activate() {
            if ($stateParams.postId && $stateParams.postId != "new") {
                isNewPost = false;
                postService.getPostById($stateParams.postId).then(function (post) {
                    vm.post = post;
                });
            }
        }
      
        function save(form) {
            if (!form.$valid) { return; }

            if (isNewPost) {
                postService.createPost(vm.post).then(function (post) {
                    toast.pop("success", "Success!", "Your post was created.");
                    $state.go("root.edit-post", { postId: post.id });
                }, function (resp) {
                    toast.pop("error", "Create Post Failed", "", resp.data);
                });
            }
            else {
                postService.updatePost(vm.post).then(function (post) {
                    toast.pop("success", "Success!", "Your post was updated.");
                    form.$setPristine();
                }, function (resp) {
                    toast.pop("error", "Update Post Failed", "", resp.data);
                });
            }
        }

        function openPublishDatePicker () {
            vm.publishDatePickerOpened = true;
        }

        function generateSlug() {
            var slug = vm.post.title.toString().toLowerCase().trim()
                        .replace(/\s+/g, "-")           // Replace spaces with -
                        .replace(/&/g, "-and-")         // Replace & with 'and'
                        .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
                        .replace(/\-\-+/g, "-");        // Replace multiple - with single -

            vm.post.slug = slug;
        }

        function overrideSlugWarning() {
            vm.slugWarningOverridden = true;
        }
    }
})();
