// Hotels service used to communicate Hotels REST endpoints
(function () {
  'use strict';

  angular
    .module('hotels')
    .factory('HotelsService', HotelsService);

  HotelsService.$inject = ['$resource'];

  function HotelsService($resource) {
    return $resource('api/hotels/:hotelId', {
      hotelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
