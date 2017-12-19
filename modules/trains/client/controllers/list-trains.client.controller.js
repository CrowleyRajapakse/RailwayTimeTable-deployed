(function () {
  'use strict';

  angular
    .module('trains')
    .controller('TrainsListController', TrainsListController);

  TrainsListController.$inject = ['TrainsService'];

  function TrainsListController(TrainsService) {
    var vm = this;

    vm.trains = TrainsService.query();
  }
}());
