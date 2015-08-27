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


var Geofencing;
(function (Geofencing) {
    Geofencing.windowLocationHref = function () {
        return window.location.href;
    };
    Geofencing.windowLocationHostname = function () {
        return window.location.hostname;
    };
    function uriParam(name) {
        var url = Geofencing.windowLocationHref();
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }
    Geofencing.uriParam = uriParam;
    Geofencing.cloudUriParam = 'cloudUri';
    function cloudletApiBase() {
        var cloudUriFromParam = uriParam(Geofencing.cloudUriParam);
        var uri = cloudUriFromParam == null ? Geofencing.windowLocationHostname() : cloudUriFromParam;
        return 'http://' + uri + ':15000';
    }
    Geofencing.cloudletApiBase = cloudletApiBase;
    function geofencingCloudletApiBase() {
        return cloudletApiBase() + '/geofencing';
    }
    Geofencing.geofencingCloudletApiBase = geofencingCloudletApiBase;
    function documentCloudletApiBase() {
        return cloudletApiBase() + '/document';
    }
    Geofencing.documentCloudletApiBase = documentCloudletApiBase;
    function deviceCloudletApiBase() {
        return cloudletApiBase();
    }
    Geofencing.deviceCloudletApiBase = deviceCloudletApiBase;
})(Geofencing || (Geofencing = {}));

var Devices;
(function (Devices) {
    Devices.pluginName = "cloudlet-device";
    Devices.log = Logger.get(Devices.pluginName);
    Devices.templatePath = "plugins/example/html";
})(Devices || (Devices = {}));

var Devices;
(function (Devices) {
    Devices._module = angular.module(Devices.pluginName, []);
    var tab = undefined;
    Devices._module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider", function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(Devices.pluginName).title(function () { return "Devices"; }).href(function () { return "/devices"; }).subPath("Devices", "devices", builder.join(Devices.templatePath, "devices.html")).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);
    Devices._module.run(["HawtioNav", function (HawtioNav) {
        HawtioNav.add(tab);
        Devices.log.debug("loaded");
    }]);
    hawtioPluginLoader.addModule(Devices.pluginName);
})(Devices || (Devices = {}));

var Devices;
(function (Devices) {
    Devices.RoutesController = Devices._module.controller("Devices.RoutesController", ["$scope", "$http", "$route", "$interval", function ($scope, $http, $route, $interval) {
        $scope.imagesPrefix = window.location.port === '2772' ? 'images' : 'libs/cloudlet-device/images';
        $scope.updateDevicesList = function () {
            $http.get(Geofencing.deviceCloudletApiBase() + '/device/disconnected').success(function (data, status, headers, config) {
                $scope.disconnectedDevices = data.disconnectedDevices;
                $http.get(Geofencing.deviceCloudletApiBase() + '/device').success(function (data, status, headers, config) {
                    $scope.devices = data.devices;
                }).error(function (data, status, headers, config) {
                    $scope.flash = 'Cannot connect to the device service.';
                });
            }).error(function (data, status, headers, config) {
                $scope.flash = 'Cannot connect to the device service.';
            });
        };
        $scope.updateDevicesList();
        $interval($scope.updateDevicesList, 1000);
        $scope.sendHeartbeat = function (deviceId) {
            $http.get(Geofencing.deviceCloudletApiBase() + '/device/' + deviceId + '/heartbeat').success(function (data, status, headers, config) {
                Devices.log.debug('Heartbeat sent to the device ' + deviceId + '.');
                $scope.updateDevicesList();
            }).error(function (data, status, headers, config) {
                $scope.flash = 'Cannot connect to the device service.';
            });
        };
        $scope.loadRoutes = function () {
            $http.get(Geofencing.geofencingCloudletApiBase() + '/routes/routes/' + $scope.selectedOption.id).success(function (data, status, headers, config) {
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
            }).error(function (data, status, headers, config) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwiZXhhbXBsZS90cy9nZW9mZW5jaW5nLnRzIiwiZXhhbXBsZS90cy9leGFtcGxlR2xvYmFscy50cyIsImV4YW1wbGUvdHMvZGV2aWNlc1BsdWdpbi50cyIsImV4YW1wbGUvdHMvcm91dGVzLnRzIl0sIm5hbWVzIjpbIkdlb2ZlbmNpbmciLCJHZW9mZW5jaW5nLnVyaVBhcmFtIiwiR2VvZmVuY2luZy5jbG91ZGxldEFwaUJhc2UiLCJHZW9mZW5jaW5nLmdlb2ZlbmNpbmdDbG91ZGxldEFwaUJhc2UiLCJHZW9mZW5jaW5nLmRvY3VtZW50Q2xvdWRsZXRBcGlCYXNlIiwiR2VvZmVuY2luZy5kZXZpY2VDbG91ZGxldEFwaUJhc2UiLCJEZXZpY2VzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDY0EsSUFBTyxVQUFVLENBc0NoQjtBQXRDRCxXQUFPLFVBQVUsRUFBQyxDQUFDO0lBRUpBLDZCQUFrQkEsR0FBR0E7UUFDNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2hDLENBQUMsQ0FBQ0E7SUFFU0EsaUNBQXNCQSxHQUFHQTtRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDcEMsQ0FBQyxDQUFDQTtJQUVGQSxTQUFnQkEsUUFBUUEsQ0FBQ0EsSUFBSUE7UUFDekJDLElBQUlBLEdBQUdBLEdBQUdBLFVBQVVBLENBQUNBLGtCQUFrQkEsRUFBRUEsQ0FBQ0E7UUFDMUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUNBLE1BQU1BLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzFEQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxNQUFNQSxDQUFFQSxRQUFRQSxHQUFDQSxJQUFJQSxHQUFDQSxXQUFXQSxDQUFFQSxDQUFDQTtRQUNwREEsSUFBSUEsT0FBT0EsR0FBR0EsS0FBS0Es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TSxDQUFDLEtBQUssR0FBRywyQ0FBMkMsQ0FBQztZQUMvRCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQ0E7UUFFRkEsTUFBTUEsQ0FBQ0EsY0FBY0EsR0FBR0E7WUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztZQUN6QyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDOUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQ0E7SUFDSkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFFTkEsQ0FBQ0EsRUFsRU0sT0FBTyxLQUFQLE9BQU8sUUFrRWIiLCJmaWxlIjoiY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9saWJzL2hhd3Rpby11dGlsaXRpZXMvZGVmcy5kLnRzXCIvPlxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5jbHVkZXMuanMubWFwIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbm1vZHVsZSBHZW9mZW5jaW5nIHtcblxuICAgIGV4cG9ydCB2YXIgd2luZG93TG9jYXRpb25IcmVmID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICB9O1xuXG4gICAgZXhwb3J0IHZhciB3aW5kb3dMb2NhdGlvbkhvc3RuYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gICAgfTtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiB1cmlQYXJhbShuYW1lKSB7XG4gICAgICAgIHZhciB1cmwgPSBHZW9mZW5jaW5nLndpbmRvd0xvY2F0aW9uSHJlZigpO1xuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXS8sXCJcXFxcXFxbXCIpLnJlcGxhY2UoL1tcXF1dLyxcIlxcXFxcXF1cIik7XG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoIFwiW1xcXFw/Jl1cIituYW1lK1wiPShbXiYjXSopXCIgKTtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSByZWdleC5leGVjKCB1cmwgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHMgPT0gbnVsbCA/IG51bGwgOiByZXN1bHRzWzFdO1xuICAgIH1cblxuICAgIGV4cG9ydCB2YXIgY2xvdWRVcmlQYXJhbSA9ICdjbG91ZFVyaSc7XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gY2xvdWRsZXRBcGlCYXNlKCkge1xuICAgICAgICB2YXIgY2xvdWRVcmlGcm9tUGFyYW0gPSB1cmlQYXJhbShjbG91ZFVyaVBhcmFtKTtcbiAgICAgICAgdmFyIHVyaSA9IGNsb3VkVXJpRnJvbVBhcmFtID09IG51bGwgPyB3aW5kb3dMb2NhdGlvbkhvc3RuYW1lKCkgOiBjbG91ZFVyaUZyb21QYXJhbTtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vJyArIHVyaSArICc6MTUwMDAnO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZW9mZW5jaW5nQ2xvdWRsZXRBcGlCYXNlKCkge1xuICAgICAgICByZXR1cm4gY2xvdWRsZXRBcGlCYXNlKCkgKyAnL2dlb2ZlbmNpbmcnO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb2N1bWVudENsb3VkbGV0QXBpQmFzZSgpIHtcbiAgICAgICAgcmV0dXJuIGNsb3VkbGV0QXBpQmFzZSgpICsgJy9kb2N1bWVudCc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRldmljZUNsb3VkbGV0QXBpQmFzZSgpIHtcbiAgICAgICAgcmV0dXJuIGNsb3VkbGV0QXBpQmFzZSgpO1xuICAgIH1cblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJnZW9mZW5jaW5nLnRzXCIvPlxubW9kdWxlIERldmljZXMge1xuXG4gIGV4cG9ydCB2YXIgcGx1Z2luTmFtZSA9IFwiY2xvdWRsZXQtZGV2aWNlXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6IExvZ2dpbmcuTG9nZ2VyID0gTG9nZ2VyLmdldChwbHVnaW5OYW1lKTtcblxuICBleHBvcnQgdmFyIHRlbXBsYXRlUGF0aCA9IFwicGx1Z2lucy9leGFtcGxlL2h0bWxcIjtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJleGFtcGxlR2xvYmFscy50c1wiLz5cbm1vZHVsZSBEZXZpY2VzIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShEZXZpY2VzLnBsdWdpbk5hbWUsIFtdKTtcblxuICB2YXIgdGFiID0gdW5kZWZpbmVkO1xuXG4gIF9tb2R1bGUuY29uZmlnKFtcIiRsb2NhdGlvblByb3ZpZGVyXCIsIFwiJHJvdXRlUHJvdmlkZXJcIiwgXCJIYXd0aW9OYXZCdWlsZGVyUHJvdmlkZXJcIixcbiAgICAoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyOiBuZy5yb3V0ZS5JUm91dGVQcm92aWRlciwgYnVpbGRlcjogSGF3dGlvTWFpbk5hdi5CdWlsZGVyRmFjdG9yeSkgPT4ge1xuICAgIHRhYiA9IGJ1aWxkZXIuY3JlYXRlKClcbiAgICAgIC5pZChEZXZpY2VzLnBsdWdpbk5hbWUpXG4gICAgICAudGl0bGUoKCkgPT4gXCJEZXZpY2VzXCIpXG4gICAgICAuaHJlZigoKSA9PiBcIi9kZXZpY2VzXCIpXG4gICAgICAuc3ViUGF0aChcIkRldmljZXNcIiwgXCJkZXZpY2VzXCIsIGJ1aWxkZXIuam9pbihEZXZpY2VzLnRlbXBsYXRlUGF0aCwgXCJkZXZpY2VzLmh0bWxcIikpXG4gICAgICAuYnVpbGQoKTtcbiAgICBidWlsZGVyLmNvbmZpZ3VyZVJvdXRpbmcoJHJvdXRlUHJvdmlkZXIsIHRhYik7XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICB9XSk7XG5cbiAgX21vZHVsZS5ydW4oW1wiSGF3dGlvTmF2XCIsIChIYXd0aW9OYXY6IEhhd3Rpb01haW5OYXYuUmVnaXN0cnkpID0+IHtcbiAgICBIYXd0aW9OYXYuYWRkKHRhYik7XG4gICAgbG9nLmRlYnVnKFwibG9hZGVkXCIpO1xuICB9XSk7XG5cblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKERldmljZXMucGx1Z2luTmFtZSk7XG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRldmljZXNQbHVnaW4udHNcIi8+XG5tb2R1bGUgRGV2aWNlcyB7XG5cbiAgZXhwb3J0IHZhciBSb3V0ZXNDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiRGV2aWNlcy5Sb3V0ZXNDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRodHRwXCIsIFwiJHJvdXRlXCIsIFwiJGludGVydmFsXCIsICgkc2NvcGUsICRodHRwLCAkcm91dGUsICRpbnRlcnZhbCkgPT4ge1xuICAgICAgJHNjb3BlLmltYWdlc1ByZWZpeCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0ID09PSAnMjc3MicgPyAnaW1hZ2VzJyA6ICdsaWJzL2Nsb3VkbGV0LWRldmljZS9pbWFnZXMnO1xuXG4gICAgICAkc2NvcGUudXBkYXRlRGV2aWNlc0xpc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkaHR0cC5nZXQoR2VvZmVuY2luZy5kZXZpY2VDbG91ZGxldEFwaUJhc2UoKSArICcvZGV2aWNlL2Rpc2Nvbm5lY3RlZCcpLlxuICAgICAgICAgICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzY29ubmVjdGVkRGV2aWNlcyA9IGRhdGEuZGlzY29ubmVjdGVkRGV2aWNlcztcbiAgICAgICAgICAgICAgICAgICRodHRwLmdldChHZW9mZW5jaW5nLmRldmljZUNsb3VkbGV0QXBpQmFzZSgpICsgJy9kZXZpY2UnKS5cbiAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZXZpY2VzID0gZGF0YS5kZXZpY2VzO1xuICAgICAgICAgICAgICAgICAgICAgIH0pLlxuICAgICAgICAgICAgICAgICAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGFzaCA9ICdDYW5ub3QgY29ubmVjdCB0byB0aGUgZGV2aWNlIHNlcnZpY2UuJztcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkuXG4gICAgICAgICAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuZmxhc2ggPSAnQ2Fubm90IGNvbm5lY3QgdG8gdGhlIGRldmljZSBzZXJ2aWNlLic7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlRGV2aWNlc0xpc3QoKTtcbiAgICAgICRpbnRlcnZhbCgkc2NvcGUudXBkYXRlRGV2aWNlc0xpc3QsIDEwMDApO1xuXG4gICAgICAkc2NvcGUuc2VuZEhlYXJ0YmVhdCA9IGZ1bmN0aW9uKGRldmljZUlkKSB7XG4gICAgICAgICAgJGh0dHAuZ2V0KEdlb2ZlbmNpbmcuZGV2aWNlQ2xvdWRsZXRBcGlCYXNlKCkgKyAnL2RldmljZS8nICsgZGV2aWNlSWQgKyAnL2hlYXJ0YmVhdCcpLlxuICAgICAgICAgICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICBsb2cuZGVidWcoJ0hlYXJ0YmVhdCBzZW50IHRvIHRoZSBkZXZpY2UgJyArIGRldmljZUlkICsgJy4nKTtcbiAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVEZXZpY2VzTGlzdCgpO1xuICAgICAgICAgICAgICB9KS5cbiAgICAgICAgICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5mbGFzaCA9ICdDYW5ub3QgY29ubmVjdCB0byB0aGUgZGV2aWNlIHNlcnZpY2UuJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICB9O1xuXG4gICAgJHNjb3BlLmxvYWRSb3V0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJGh0dHAuZ2V0KEdlb2ZlbmNpbmcuZ2VvZmVuY2luZ0Nsb3VkbGV0QXBpQmFzZSgpICsgJy9yb3V0ZXMvcm91dGVzLycgKyAkc2NvcGUuc2VsZWN0ZWRPcHRpb24uaWQpLlxuICAgICAgICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICRzY29wZS5yb3V0ZXMgPSBkYXRhLnJvdXRlcy5tYXAoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm91dGVUaW1lc3RhbXAgPSBuZXcgRGF0ZSh2YWwuY3JlYXRlZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lc3RhbXAgPSAocm91dGVUaW1lc3RhbXAuZ2V0TW9udGgoKSArIDEpICsgXCItXCIgKyByb3V0ZVRpbWVzdGFtcC5nZXREYXRlKCkgKyBcIi1cIiArIHJvdXRlVGltZXN0YW1wLmdldEZ1bGxZZWFyKCkgKyAnICcgKyByb3V0ZVRpbWVzdGFtcC5nZXRIb3VycygpICsgXCI6XCIgKyByb3V0ZVRpbWVzdGFtcC5nZXRNaW51dGVzKCkgKyBcIjpcIiArIHJvdXRlVGltZXN0YW1wLmdldFNlY29uZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB2YWwuaWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZihkYXRhLnJvdXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFJvdXRlID0gJHNjb3BlLnJvdXRlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJvdXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5cbiAgICAgICAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZsYXNoID0gJ0Nhbm5vdCBjb25uZWN0IHRvIHRoZSBnZW9mZW5jaW5nIHNlcnZpY2UuJztcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2xpZW50U2VsZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5jbGllbnQgPSAkc2NvcGUuc2VsZWN0ZWRPcHRpb24uaWQ7XG4gICAgICAkc2NvcGUucm91dGVzRXhwb3J0TGluayA9IEdlb2ZlbmNpbmcuZ2VvZmVuY2luZ0Nsb3VkbGV0QXBpQmFzZSgpICsgJy9yb3V0ZXMvZXhwb3J0LycgKyAkc2NvcGUuY2xpZW50ICsgJy94bHMnO1xuICAgICAgJHNjb3BlLmxvYWRSb3V0ZXMoKTtcbiAgICB9O1xuICB9XSk7XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
angular.module("device-ui-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/example/html/devices.html","<!--\n Licensed to the Camel Labs under one or more\n contributor license agreements.  See the NOTICE file distributed with\n this work for additional information regarding copyright ownership.\n The licenses this file to You under the Apache License, Version 2.0\n (the \"License\"); you may not use this file except in compliance with\n the License.  You may obtain a copy of the License at\n\n      http://www.apache.org/licenses/LICENSE-2.0\n\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an \"AS IS\" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n See the License for the specific language governing permissions and\n limitations under the License.\n-->\n<div class=\"row\">\n    <div class=\"col-md-12\" ng-controller=\"Devices.RoutesController\">\n        <p ng-show=\"flash\">{{flash}}</p>\n\n        <h2>Devices registered in the cloud</h2>\n\n        <p>\n            <table ng-show=\"devices.length > 0\">\n                <tr ng-repeat=\"device in devices\">\n                    <td style=\"padding-right: 10px;padding-bottom: 10px;\">\n                        <i ng-show=\"!disconnectedDevices.contains(device.endpoint)\" class=\"fa fa-heart\"> {{device.endpoint}}</i>\n                        <i ng-show=\"disconnectedDevices.contains(device.endpoint)\" class=\"fa fa-heart-o\"> {{device.endpoint}}</i>\n                    </td>\n                    <td style=\"padding-right: 10px;padding-bottom: 10px;\">\n                        <button class=\"btn\" ng-click=\"sendHeartbeat(device.endpoint)\">\n                            Send heartbeat\n                        </button>\n                    </td>\n                </tr>\n            </table>\n\n            <div ng-show=\"devices.length === 0\">\n                No devices registered in the cloud. Use our\n                <a href=\"https://github.com/rhiot/rhiot/blob/master/docs/readme.md#device-management-rest-api\">REST</a>\n                or LWM2M APIs to connect your devices.\n            </div>\n        </p>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("device-ui-templates");