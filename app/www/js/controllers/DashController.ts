class DashController {

  constructor(private $scope, private GeoApiService, private GeoLocationService) {
    $scope.$ctrl = this;
    this.GeoLocationService.getCoordinates().then((coordinates) => {
      this.coordinates = coordinates;
      this.$scope.$apply();
    })
  }




}

angular.module('starter')
  .controller('DashController', DashController);
