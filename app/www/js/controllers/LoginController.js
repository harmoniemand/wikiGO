var LoginController = (function () {
    function LoginController($scope, GeoApiService, GeoLocationService, $state) {
        this.GeoApiService = GeoApiService;
        this.GeoLocationService = GeoLocationService;
        this.$state = $state;
        $(".title.title-left").text("WikiGO!");
        $scope.$ctrl = this;
        window.GeoApiService = GeoApiService;
        window.GeoLocationService = GeoLocationService;
    }
    LoginController.prototype.showLogin = function () {
        var _this = this;
        var popup = window.open('http://wikigo-93973.onmodulus.net/api/user/auth/mediawiki', '_blank');
        popup.addEventListener('loadstart', function (event) {
            console.log(event.url);
            if (event.url.indexOf('auth-success.html') >= 0) {
                popup.close();
                _this.$state.go('tab.dash');
            }
        });
    };
    return LoginController;
}());
angular.module('starter')
    .controller('LoginController', LoginController);
//# sourceMappingURL=LoginController.js.map