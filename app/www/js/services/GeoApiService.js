var GeoApiService = (function () {
    function GeoApiService($http) {
        this.$http = $http;
    }
    GeoApiService.prototype.getChallengesForPlaceIds = function (placeIds) {
        var url = 'http://wikigo-93973.onmodulus.net/api/challenges/for-place-ids?ids=' + placeIds.join(',');
        return this.$http.get(url).then(function (res) {
            return Promise.resolve(res.data);
        });
    };
    GeoApiService.prototype.getNearby = function (coordinates) {
        var url = 'http://wikigo-93973.onmodulus.net/api/geo/nearby?lon={{lon}}&lat={{lat}}'
            .replace('{{lon}}', coordinates[0])
            .replace('{{lat}}', coordinates[1]);
        return this.$http.get(url).then(function (res) {
            return Promise.resolve(res.data);
        });
    };
    GeoApiService.prototype.completeChallenge = function (placeId, challengeType) {
        var url = 'http://wikigo-93973.onmodulus.net/api/challenges/for-place/{{placeId}}/complete/{{challengeType}}'
            .replace('{{placeId}}', placeId)
            .replace('{{challengeType}}', challengeType);
        return this.$http.post(url).then(function (res) {
            return Promise.resolve(res.data);
        });
    };
    GeoApiService.prototype.test = function () {
        var url = 'http://wikigo-93973.onmodulus.net/test';
        return this.$http.get(url).then(function (res) {
            return Promise.resolve(res.data);
        });
    };
    return GeoApiService;
}());
angular.module('starter')
    .service('GeoApiService', GeoApiService);
//# sourceMappingURL=GeoApiService.js.map