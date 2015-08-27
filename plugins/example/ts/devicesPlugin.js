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
/// <reference path="../../includes.ts"/>
/// <reference path="exampleGlobals.ts"/>
var Devices;
(function (Devices) {
    Devices._module = angular.module(Devices.pluginName, []);
    var tab = undefined;
    Devices._module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider",
        function ($locationProvider, $routeProvider, builder) {
            tab = builder.create()
                .id(Devices.pluginName)
                .title(function () { return "Devices"; })
                .href(function () { return "/devices"; })
                .subPath("Devices", "devices", builder.join(Devices.templatePath, "devices.html"))
                .build();
            builder.configureRouting($routeProvider, tab);
            $locationProvider.html5Mode(true);
        }]);
    Devices._module.run(["HawtioNav", function (HawtioNav) {
            HawtioNav.add(tab);
            Devices.log.debug("loaded");
        }]);
    hawtioPluginLoader.addModule(Devices.pluginName);
})(Devices || (Devices = {}));
//# sourceMappingURL=devicesPlugin.js.map