(function () {
  'use strict';

  angular
    .module('trains')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trains', {
        abstract: true,
        url: '/trains',
        template: '<ui-view/>'
      })
      .state('trains.list', {
        url: '',
        templateUrl: 'modules/trains/client/views/list-trains.client.view.html',
        controller: 'TrainsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Trains List'
        }
      })
      .state('trains.create', {
        url: '/create',
        templateUrl: 'modules/trains/client/views/form-train.client.view.html',
        controller: 'TrainsController',
        controllerAs: 'vm',
        resolve: {
          trainResolve: newTrain
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Trains Create'
        }
      })
      .state('trains.edit', {
        url: '/:trainId/edit',
        templateUrl: 'modules/trains/client/views/form-train.client.view.html',
        controller: 'TrainsController',
        controllerAs: 'vm',
        resolve: {
          trainResolve: getTrain
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Train {{ trainResolve.name }}'
        }
      })
      .state('trains.view', {
        url: '/:trainId',
        templateUrl: 'modules/trains/client/views/view-train.client.view.html',
        controller: 'TrainsController',
        controllerAs: 'vm',
        resolve: {
          trainResolve: getTrain
        },
        data: {
          pageTitle: 'Train {{ trainResolve.name }}'
        }
      });
  }

  getTrain.$inject = ['$stateParams', 'TrainsService'];

  function getTrain($stateParams, TrainsService) {
    return TrainsService.get({
      trainId: $stateParams.trainId
    }).$promise;
  }

  newTrain.$inject = ['TrainsService'];

  function newTrain(TrainsService) {
    return new TrainsService();
  }
}());
