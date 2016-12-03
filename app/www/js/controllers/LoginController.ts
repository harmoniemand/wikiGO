class LoginController {

  constructor($scope, private GeoApiService, private GeoLocationService, private $state) {
    $scope.$ctrl = this;
    window.GeoApiService = GeoApiService;
    window.GeoLocationService = GeoLocationService;
  }

  public showLogin() {
    var popup = window.open('http://wikigo-93973.onmodulus.net/api/user/auth/mediawiki', '_blank');
    popup.addEventListener('loadstart', (event) => {
      console.log(event.url);
      if (event.url.indexOf('auth-success.html') >= 0) {
        popup.close();
        this.$state.go('tab.dash');
      }
    });
  }

}

angular.module('starter')
  .controller('LoginController', LoginController);
