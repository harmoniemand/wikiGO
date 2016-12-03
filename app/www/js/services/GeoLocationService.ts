class GeoLocationService {

  public getCoordinates() {
    let promise = new Promise((resolve, reject) => {
      let onSuccess = function (position) {
        let coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        resolve(coordinates);
      };
      navigator.geolocation.getCurrentPosition(onSuccess, reject);
    });
    return promise;
  }

}

angular.module('starter')
  .service('GeoLocationService', GeoLocationService);

