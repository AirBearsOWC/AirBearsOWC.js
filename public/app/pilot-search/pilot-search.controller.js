(function () {
    "use strict";

    angular
        .module("app")
        .controller("PilotSearchController", PilotSearchController);

    PilotSearchController.$inject = ["$scope", "toast", "pilotService", "authService", "userService", "registrationService"];

    function PilotSearchController($scope, toast, pilotService, authService, userService, registrationService) {
        var vm = this;

        vm.user = null;
        vm.results = null;
        vm.filteredResults = null;
        vm.currentPage = 1;
        vm.pageSize = 8;
        vm.distances = [
            { value: 1, name: "1 mile" },
            { value: 5, name: "5 miles" },
            { value: 10, name: "10 miles" },
            { value: 25, name: "25 miles" },
            { value: 50, name: "50 miles" },
            { value: 100, name: "100 miles" },
            { value: 250, name: "250 miles" },
            { value: 500, name: "500 miles" },
            { value: 1000, name: "1000 miles" }
        ];
        vm.payloads = [
            {
                "name": "Any"
            },
            {
                "id": "7765e25b-4627-4cfe-c566-08d3569d9dc6",
                "name": "None",
                "sortOrder": 0
            },
            {
                "id": "73536636-e4b8-49c4-c567-08d3569d9dc6",
                "name": "1 Pound",
                "sortOrder": 1
            },
            {
                "id": "242fec0b-aef6-431d-c568-08d3569d9dc6",
                "name": "2 Pounds",
                "sortOrder": 2
            },
            {
                "id": "fa346300-600d-4a77-c569-08d3569d9dc6",
                "name": "3 Pounds",
                "sortOrder": 3
            },
            {
                "id": "c909d0bd-f1f7-4a7e-c56a-08d3569d9dc6",
                "name": "4 Pounds",
                "sortOrder": 4
            },
            {
                "id": "3bf38916-fa91-4e98-c56b-08d3569d9dc6",
                "name": "5+ Pounds",
                "sortOrder": 5
            }
        ];
        vm.flightTimes = [
            {
                "name": "Any"
            },
            {
                "id": "8212bf81-ba01-4a3b-39ef-08d3569d9ddc",
                "name": "1-2 Minutes",
                "sortOrder": 0
            },
            {
                "id": "896cbc67-f3f8-4e57-39f0-08d3569d9ddc",
                "name": "2-5 Minutes",
                "sortOrder": 1
            },
            {
                "id": "e136336b-3fda-429e-39f1-08d3569d9ddc",
                "name": "5-10 Minutes",
                "sortOrder": 2
            },
            {
                "id": "8de6ea3d-0349-40fc-39f2-08d3569d9ddc",
                "name": "10+ Minutes",
                "sortOrder": 3
            }
        ];
        vm.massEmailRecipients = '';

        vm.isSearching = false;

        vm.advancedFiltersOpen = false;
        vm.filterICS = false;
        vm.filterPart107 = false;
        vm.filterNightVision = false;
        vm.filterThermalVision = false;
        vm.filterHamRadio = false;
        vm.payloadFilter = null;
        vm.flightTimeFilter = null;

        vm.toggleMarkerWindow = toggleMarkerWindow;
        vm.selectPilot = selectPilot;
        vm.search = search;
        vm.pageChanged = pageChanged;
        vm.openRegistrationOptions = registrationService.openRegistrationOptions;
        vm.openLogin = authService.openLogin;
        vm.filterSearchResults = filterSearchResults;

        activate();

        function activate() {
            if (authService.getAuthToken()) {
                getCurrentUser();
            }
            else { vm.user = null; }

            // Set default distance to 10 miles.
            vm.distance = vm.distances[2];

            authService.onLogin($scope, function () {
                getCurrentUser();
            });
        }

        function selectPilot(pilot) {
            pilot.show = !pilot.show;
            if(pilot.show) {
                vm.massEmailRecipients += vm.massEmailRecipients.length ? ''.concat(',', pilot.email) : pilot.email;
            } else {
                vm.massEmailRecipients = vm.massEmailRecipients.replace(
                    vm.massEmailRecipients.indexOf(pilot.email.concat(',')) !== -1 ?
                        pilot.email.concat(',') :
                            vm.massEmailRecipients.indexOf(','.concat(pilot.email)) !== -1 ?
                                ','.concat(pilot.email) :
                                pilot.email, '');
            }
        }

        function toggleMarkerWindow(marker, eventName, model) {
            selectPilot(model);
        };

        function search(isValid) {
            if (!isValid) { return; }

            var searchCriteria = {
                distance: vm.distance.value,
                address: vm.address,
                latitude: null,
                longitude: null
            };
            
            vm.isSearching = true;

            //var address = angular.isObject(vm.address) ? vm.address.formatted_address : vm.address;

            if (angular.isObject(vm.address)) {
                searchCriteria.latitude = vm.address.geometry.location.lat();
                searchCriteria.longitude = vm.address.geometry.location.lng();
                searchCriteria.address = null;

                var radius = (vm.distance.value / 3963.1676) * 6378100;
                var scale = radius / 500;
                var zoomLevel = Math.round(16.5 - Math.log(scale) / Math.log(2)) - 1;

                vm.map = { center: { latitude: searchCriteria.latitude, longitude: searchCriteria.longitude }, zoom: zoomLevel };
                vm.circle = {
                    center: {
                        latitude: searchCriteria.latitude,
                        longitude: searchCriteria.longitude
                    },
                    radius: radius,
                    stroke: {
                        color: "#08B21F",
                        weight: 1,
                        opacity: 0.5
                    },
                    fill: {
                        color: "#08B21F",
                        opacity: 0.2
                    }
                };
            }           

            pilotService.search(searchCriteria).then(function (data) {
                angular.forEach(data, function (item) {
                    item.windowTemplate = "app/pilot-search/pilot-window.html";
                });

                vm.results = data;
                filterSearchResults();
                vm.isSearching = false;
                vm.currentPage = 1;
                vm.advancedFiltersOpen = false;
            }, 
            function (resp) {
                vm.isSearching = false;
                if (resp.status !== 401) {
                    toast.pop("error", "Search Error", "", resp.data);
                }
            });
        }

        function filterSearchResults() {
            function filterBool(result, keyName) {
                return result[keyName] === true;
            }

            var filterPayload = function(result) {
                if(result.payload) {
                    return result.payload.name === this.payloadFilter.name;
                }
                return false;
            };

            filterPayload = filterPayload.bind(vm);

            var filterFlightTime = function(result) {
                if(result.flightTime) {
                    return result.flightTime.name === this.flightTimeFilter.name;
                }
                return false;
            };

            filterFlightTime = filterFlightTime.bind(vm);

            if(!vm.results || !vm.results.length) {
                console.log('Nothing to filter!');
                return;
            }
            var filtered = vm.results;
            if(vm.filterICS) {
                filtered = filtered.filter(function(result){
                    return filterBool(result, 'femaIcsCertified');
                });
            }
            if(vm.filterPart107) {
                filtered = filtered.filter(function(result){
                    return filterBool(result, 'faaPart107Certified')
                });
            }
            if(vm.filterNightVision) {
                filtered = filtered.filter(function(result){
                    return filterBool(result, 'nightVisionCapable')
                });
            }
            if(vm.filterThermalVision) {
                filtered = filtered.filter(function(result){
                    return filterBool(result, 'thermalVisionCapable')
                });
            }
            if(vm.filterHamRadio) {
                filtered = filtered.filter(function(result){
                    return filterBool(result, 'hamRadioLicensed')
                });
            }
            if(vm.payloadFilter && vm.payloadFilter.name !== "Any") {
                filtered = filtered.filter(filterPayload);
            }
            if(vm.flightTimeFilter && vm.flightTimeFilter.name !== "Any") {
                filtered = filtered.filter(filterFlightTime);
            }
            vm.filteredResults = filtered;
        }

        function pageChanged() {
            //search(true, true);
        }

        function getCurrentUser() {
            return userService.getCurrentUser().then(function (user) {
                vm.user = user;
            }, function (error) {
                vm.user = null;
            });
        }
    }
})();