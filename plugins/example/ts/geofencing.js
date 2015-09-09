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
var Device;
(function (Device) {
    Device.windowLocationHref = function () {
        return window.location.href;
    };
    Device.windowLocationHostname = function () {
        return window.location.hostname;
    };
    function uriParam(name) {
        var url = Device.windowLocationHref();
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }
    Device.uriParam = uriParam;
    Device.cloudUriParam = 'cloudUri';
    function cloudletApiBase() {
        var cloudUriFromParam = uriParam(Device.cloudUriParam);
        var uri = cloudUriFromParam == null ? Device.windowLocationHostname() : cloudUriFromParam;
        return 'http://' + uri + ':15000';
    }
    Device.cloudletApiBase = cloudletApiBase;
    function geofencingCloudletApiBase() {
        return cloudletApiBase() + '/geofencing';
    }
    Device.geofencingCloudletApiBase = geofencingCloudletApiBase;
    function deviceCloudletApiBase() {
        return cloudletApiBase();
    }
    Device.deviceCloudletApiBase = deviceCloudletApiBase;
    function deviceManagementCloudletFailure(scope) {
        scope.flash = 'Cannot connect to the Device Management Cloudlet.';
        scope.isDeviceManagementCloudletConnected = false;
    }
    Device.deviceManagementCloudletFailure = deviceManagementCloudletFailure;
})(Device || (Device = {}));
//# sourceMappingURL=geofencing.js.map