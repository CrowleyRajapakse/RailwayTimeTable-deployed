// Trains service used to communicate Trains REST endpoints
(function () {
  'use strict';

  angular
    .module('trains')
    .factory('TrainsService', TrainsService);

  TrainsService.$inject = ['$resource'];

  function TrainsService($resource) {
    return $resource('api/trains/:trainId', {
      trainId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
