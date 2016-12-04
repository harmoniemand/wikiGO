var DashController = (function () {
    function DashController($scope, GeoApiService, GeoLocationService, $ionicModal) {
        var _this = this;
        this.$scope = $scope;
        this.GeoApiService = GeoApiService;
        this.GeoLocationService = GeoLocationService;
        this.$ionicModal = $ionicModal;
        $scope.$ctrl = this;
        $scope.$on('leafletDirectiveMarker.mousedown', function (event, args) {
            _this.selectedMarker = args.model;
            _this.selectedMarker.challenges = [];
            _this.selectedMarker.isLoading = true;
            _this.GeoApiService.getChallengesForPlaceIds([_this.selectedMarker._id]).then(function (challengeList) {
                _this.selectedMarker.isLoading = false;
                if (challengeList.length < 1) {
                    _this.$scope.$apply();
                    return;
                }
                _this.selectedMarker.challenges = challengeList[0].list;
                _this.$scope.$apply();
            }).catch(function () {
                _this.selectedMarker.isLoading = false;
                _this.$scope.$apply();
            });
            args.leafletObject.openPopup();
        });
        this.center = {
            lat: 48.400722,
            lng: 9.9876367,
            zoom: 12
        };
        this.defaults = {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
        };
        this.markers = [];
        this.GeoLocationService.getCoordinates().then(function (coordinates) {
            _this.coordinates = coordinates;
            _this.center.lat = coordinates.lat;
            _this.center.lng = coordinates.lon;
            _this.GeoApiService.getNearby([coordinates.lon, coordinates.lat]).then(function (results) {
                results.forEach(function (result) {
                    var lon = result.geo.coordinates[0];
                    var lat = result.geo.coordinates[1];
                    var marker = {
                        _id: result._id,
                        lat: lat,
                        lng: lon,
                        name: result.name,
                        message: result.name
                    };
                    _this.markers.push(marker);
                });
            });
            _this.$scope.$apply();
        });
    }
    DashController.prototype.showChallengeForSelectedMarker = function () {
        this.$ionicModal.fromTemplateUrl('templates/modal-challenges-for-marker.html', {
            scope: this.$scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modal.show();
        });
    };
    return DashController;
}());
angular.module('starter')
    .controller('DashController', DashController);
//# sourceMappingURL=DashController.js.map