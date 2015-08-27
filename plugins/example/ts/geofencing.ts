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

module Device {

    export var windowLocationHref = function() {
        return window.location.href;
    };

    export var windowLocationHostname = function() {
        return window.location.hostname;
    };

    export function uriParam(name) {
        var url = Device.windowLocationHref();
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regex = new RegExp( "[\\?&]"+name+"=([^&#]*)" );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }

    export var cloudUriParam = 'cloudUri';

    export function cloudletApiBase() {
        var cloudUriFromParam = uriParam(cloudUriParam);
        var uri = cloudUriFromParam == null ? windowLocationHostname() : cloudUriFromParam;
        return 'http://' + uri + ':15000';
    }

    export function geofencingCloudletApiBase() {
        return cloudletApiBase() + '/geofencing';
    }

    export function documentCloudletApiBase() {
        return cloudletApiBase() + '/document';
    }

    export function deviceCloudletApiBase() {
        return cloudletApiBase();
    }

    export function deviceManagementCloudletFailure(scope) {
        scope.flash = 'Cannot connect to the Device Management Cloudlet.';
        scope.isDeviceManagementCloudletConnected = false;
    }

}
