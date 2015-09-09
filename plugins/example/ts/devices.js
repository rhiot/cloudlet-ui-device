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
                $http.get(Device.deviceCloudletApiBase() + '/device/disconnected').
                    success(function (data, status, headers, config) {
                    $scope.disconnectedDevices = data.disconnectedDevices;
                    $http.get(Device.deviceCloudletApiBase() + '/device').
                        success(function (data, status, headers, config) {
                        $scope.isDeviceManagementCloudletConnected = true;
                        $scope.devices = data.devices;
                    }).
                        error(function (data, status, headers, config) {
                        Device.deviceManagementCloudletFailure($scope);
                    });
                }).
                    error(function (data, status, headers, config) {
                    Device.deviceManagementCloudletFailure($scope);
                });
            };
            $scope.updateDevicesList();
            $interval($scope.updateDevicesList, 1000);
            $scope.sendHeartbeat = function (deviceId) {
                $http.get(Device.deviceCloudletApiBase() + '/device/' + deviceId + '/heartbeat').
                    success(function (data, status, headers, config) {
                    Devices.log.debug('Heartbeat sent to the device ' + deviceId + '.');
                    $scope.updateDevicesList();
                }).
                    error(function (data, status, headers, config) {
                    Device.deviceManagementCloudletFailure($scope);
                });
            };
            $scope.deregister = function (deviceId) {
                $http.delete(Device.deviceCloudletApiBase() + '/device/' + deviceId).
                    success(function (data, status, headers, config) {
                    Devices.log.debug('Device ' + deviceId + ' deregistered.');
                    $scope.updateDevicesList();
                }).
                    error(function (data, status, headers, config) {
                    Device.deviceManagementCloudletFailure($scope);
                });
            };
            $scope.createVirtualDevice = function (deviceId) {
                var device = { clientId: deviceId };
                $http.post(Device.deviceCloudletApiBase() + '/client', device).
                    success(function (data, status, headers, config) {
                    Devices.log.debug('New virtual device ' + deviceId + ' has been created.');
                    $scope.newDeviceId = '';
                    $scope.updateDevicesList();
                }).
                    error(function (data, status, headers, config) {
                    Device.deviceManagementCloudletFailure($scope);
                });
            };
        }]);
})(Devices || (Devices = {}));
//# sourceMappingURL=devices.js.map