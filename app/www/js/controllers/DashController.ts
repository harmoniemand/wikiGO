class DashController {

  constructor(private $scope, private GeoApiService, private GeoLocationService, private $ionicModal) {
    $(".title.title-left").text("WikiGO!");
    $scope.$ctrl = this;
    $scope.$on('leafletDirectiveMarker.mousedown', (event, args) => {
      this.selectedMarker = args.model;
      this.updateChallengeInfoForSelected();
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
    this.GeoLocationService.getCoordinates().then((coordinates) => {
      this.coordinates = coordinates;
      this.center.lat = coordinates.lat;
      this.center.lng = coordinates.lon;
      this.GeoApiService.getNearby([coordinates.lon, coordinates.lat]).then((results) => {
        results.forEach((result) => {
          let lon = result.geo.coordinates[0];
          let lat = result.geo.coordinates[1];
          let marker = {
            _id: result._id,
            lat:lat,
            lng:lon,
            name: result.name,
            message: result.name
          };
          this.markers.push(marker);
        })
      });
      this.$scope.$apply();
    })
  }

  private updateChallengeInfoForSelected() {
    this.selectedMarker.challenges = [];
    this.selectedMarker.isLoading = true;
    this.GeoApiService.getChallengesForPlaceIds([this.selectedMarker._id]).then((challengeList) => {
      this.selectedMarker.isLoading = false;
      if (challengeList.length < 1) {
        this.$scope.$apply();
        return ;
      }
      this.selectedMarker.challenges = challengeList[0].list;
      this.$scope.$apply();
    }).catch(() => {
      this.selectedMarker.isLoading = false;
      this.$scope.$apply();
    });
  }


  public showChallengeForSelectedMarker() {
    this.$ionicModal.fromTemplateUrl('templates/modal-challenges-for-marker.html', {
      scope: this.$scope,
      animation: 'slide-in-up'
    }).then((modal) => {
      modal.show();
      this._showChallengeInfoModal = modal;
    });
  }

  public acceptChallenge(challenge) {
    //alert(JSON.stringify(challenge));
    if ("shoot-photo" == challenge.type) {
      navigator.camera.getPicture((imageURI) => {
        alert(imageURI);
      }, (err) => {

      }, {});
    }
    if ("install-wikistop-module" == challenge.type) {
      alert('Ein WikiStop Modul wurde erfolgreich installiert!')
    }
    if (!!this._showChallengeInfoModal) {
      this._showChallengeInfoModal.hide();
    }
    this.GeoApiService.completeChallenge(this.selectedMarker._id, challenge.type).then(() => {
      this.updateChallengeInfoForSelected();
    });
  }

}

angular.module('starter')
  .controller('DashController', DashController);
