(function () {
  'use strict';

  // Trains controller
  angular
    .module('trains')
    .controller('TrainsController', TrainsController);

  TrainsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'trainResolve','FileUploader'];

  function TrainsController ($scope, $state, $window, Authentication, train,FileUploader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.train = train;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.uploadPicture = uploadPicture;

    function uploadPicture() {
      /*
        var f = document.getElementById('file').files[0],
            r = new FileReader();

        r.onloadend = function(e) {
            var data = e.target.result;
            //send your binary data via $http or $resource or do anything else with it
        };

        r.readAsBinaryString(f);
        */
    }

    // Remove existing Train
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.train.$remove($state.go('trains.list'));
      }
    }

    // Save Train
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trainForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.train._id) {
        vm.train.$update(successCallback, errorCallback);
      } else {
        vm.train.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trains.view', {
          trainId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
}());
