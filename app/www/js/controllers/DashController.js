var DashController = (function () {
    function DashController($scope, GeoApiService, GeoLocationService) {
        var _this = this;
        this.$scope = $scope;
        this.GeoApiService = GeoApiService;
        this.GeoLocationService = GeoLocationService;
        $scope.$ctrl = this;
        this.GeoLocationService.getCoordinates().then(function (coordinates) {
            _this.coordinates = coordinates;
            _this.$scope.$apply();
        });
    }
    return DashController;
}());
angular.module('starter')
    .controller('DashController', DashController);
//# sourceMappingURL=DashController.js.map