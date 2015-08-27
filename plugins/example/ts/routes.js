/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
/// <reference path="devicesPlugin.ts"/>
var Devices;
(function (Devices) {
    Devices.RoutesController = Devices._module.controller("Devices.RoutesController", ["$scope", "$http", "$route", "$interval", function ($scope, $http, $route, $interval) {
            $scope.imagesPrefix = window.location.port === '2772' ? 'images' : 'libs/cloudlet-device/images';
            $scope.updateDevicesList = function () {
                $http.get(Geofencing.deviceCloudletApiBase() + '/device/disconnected').
                    success(function (data, status, headers, config) {
                    $scope.disconnectedDevices = data.disconnectedDevices;
                    $http.get(Geofencing.deviceCloudletApiBase() + '/device').
                        success(function (data, status, headers, config) {
                        $scope.devices = data.devices;
                    }).
                        error(function (data, status, headers, config) {
                        $scope.flash = 'Cannot connect to the device service.';
                    });
                }).
                    error(function (data, status, headers, config) {
                    $scope.flash = 'Cannot connect to the device service.';
                });
            };
            $scope.updateDevicesList();
            $interval($scope.updateDevicesList, 1000);
            $scope.sendHeartbeat = function (deviceId) {
                $http.get(Geofencing.deviceCloudletApiBase() + '/device/' + deviceId + '/heartbeat').
                    success(function (data, status, headers, config) {
                    Devices.log.debug('Heartbeat sent to the device ' + deviceId + '.');
                    $scope.updateDevicesList();
                }).
                    error(function (data, status, headers, config) {
                    $scope.flash = 'Cannot connect to the device service.';
                });
            };
            $scope.loadRoutes = function () {
                $http.get(Geofencing.geofencingCloudletApiBase() + '/routes/routes/' + $scope.selectedOption.id).
                    success(function (data, status, headers, config) {
                    $scope.routes = data.routes.map(function (val) {
                        var routeTimestamp = new Date(val.created);
                        var timestamp = (routeTimestamp.getMonth() + 1) + "-" + routeTimestamp.getDate() + "-" + routeTimestamp.getFullYear() + ' ' + routeTimestamp.getHours() + ":" + routeTimestamp.getMinutes() + ":" + routeTimestamp.getSeconds();
                        return {
                            name: timestamp,
                            id: val.id
                        };
                    });
                    if (data.routes.length > 0) {
                        $scope.selectedRoute = $scope.routes[0];
                        $scope.routeSelected();
                    }
                }).
                    error(function (data, status, headers, config) {
                    $scope.flash = 'Cannot connect to the geofencing service.';
                });
            };
            $scope.clientSelected = function () {
                $scope.client = $scope.selectedOption.id;
                $scope.routesExportLink = Geofencing.geofencingCloudletApiBase() + '/routes/export/' + $scope.client + '/xls';
                $scope.loadRoutes();
            };
        }]);
})(Devices || (Devices = {}));
//# sourceMappingURL=routes.js.map