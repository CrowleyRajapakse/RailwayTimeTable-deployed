(function () {
  'use strict';

  angular
    .module('hotels')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hotels', {
        abstract: true,
        url: '/hotels',
        template: '<ui-view/>'
      })
      .state('hotels.list', {
        url: '',
        templateUrl: 'modules/hotels/client/views/list-hotels.client.view.html',
        controller: 'HotelsListController',
        controllerAs: 'vm',
        data: {
          roles: ['hotelowner', 'admin','commuter'],
          pageTitle: 'Hotels List'
        }
      })
      .state('hotels.create', {
        url: '/create',
        templateUrl: 'modules/hotels/client/views/form-hotel.client.view.html',
        controller: 'HotelsController',
        controllerAs: 'vm',
        resolve: {
          hotelResolve: newHotel
        },
        data: {
          roles: ['hotelowner', 'admin'],
          pageTitle: 'Hotels Create'
        }
      })
      .state('hotels.edit', {
        url: '/:hotelId/edit',
        templateUrl: 'modules/hotels/client/views/form-hotel.client.view.html',
        controller: 'HotelsController',
        controllerAs: 'vm',
        resolve: {
          hotelResolve: getHotel
        },
        data: {
          roles: ['hotelowner', 'admin'],
          pageTitle: 'Edit Hotel {{ hotelResolve.name }}'
        }
      })
      .state('hotels.view', {
        url: '/:hotelId',
        templateUrl: 'modules/hotels/client/views/view-hotel.client.view.html',
        controller: 'HotelsController',
        controllerAs: 'vm',
        resolve: {
          hotelResolve: getHotel
        },
        data: {
          roles: ['hotelowner', 'admin','commuter'],
          pageTitle: 'Hotel {{ hotelResolve.name }}'
        }
      });
  }

  getHotel.$inject = ['$stateParams', 'HotelsService'];

  function getHotel($stateParams, HotelsService) {
    return HotelsService.get({
      hotelId: $stateParams.hotelId
    }).$promise;
  }

  newHotel.$inject = ['HotelsService'];

  function newHotel(HotelsService) {
    return new HotelsService();
  }
}());
