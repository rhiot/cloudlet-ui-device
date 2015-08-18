declare module Geofencing {
    var windowLocationHref: () => string;
    var windowLocationHostname: () => string;
    function uriParam(name: any): string;
    var cloudUriParam: string;
    function cloudletApiBase(): string;
    function geofencingCloudletApiBase(): string;
    function documentCloudletApiBase(): string;
}
