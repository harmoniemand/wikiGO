class GeoApiService {
  constructor(private $http) {

  }


  public getChallengesForPlaceIds(placeIds) {
    let url = 'http://wikigo-93973.onmodulus.net/api/challenges/for-place-ids?ids='+placeIds.join(',');
    return this.$http.get(url).then((res) => {
      return Promise.resolve(res.data);
    });
  }

  public getNearby(coordinates:Array<number>) {
    let url = 'http://wikigo-93973.onmodulus.net/api/geo/nearby?lon={{lon}}&lat={{lat}}'
      .replace('{{lon}}', coordinates[0])
      .replace('{{lat}}', coordinates[1]);
    return this.$http.get(url).then((res) => {
      return Promise.resolve(res.data);
    });
  }

  public completeChallenge(placeId, challengeType) {
    let url = 'http://wikigo-93973.onmodulus.net/api/challenges/for-place/{{placeId}}/complete/{{challengeType}}'
      .replace('{{placeId}}', placeId)
      .replace('{{challengeType}}', challengeType);
    return this.$http.post(url).then((res) => {
      return Promise.resolve(res.data);
    });
  }

  public test() {
    let url = 'http://wikigo-93973.onmodulus.net/test';
    return this.$http.get(url).then((res) => {
      return Promise.resolve(res.data);
    });
  }
}

angular.module('starter')
  .service('GeoApiService', GeoApiService);
