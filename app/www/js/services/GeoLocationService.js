var GeoLocationService = (function () {
    function GeoLocationService() {
    }
    GeoLocationService.prototype.getCoordinates = function () {
        var promise = new Promise(function (resolve, reject) {
            var onSuccess = function (position) {
                var coordinates = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                resolve(coordinates);
            };
            navigator.geolocation.getCurrentPosition(onSuccess, reject);
        });
        return promise;
    };
    return GeoLocationService;
}());
angular.module('starter')
    .service('GeoLocationService', GeoLocationService);
//# sourceMappingURL=GeoLocationService.js.map