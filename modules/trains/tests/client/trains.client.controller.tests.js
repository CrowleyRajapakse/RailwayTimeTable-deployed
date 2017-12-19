(function () {
  'use strict';

  describe('Trains Controller Tests', function () {
    // Initialize global variables
    var TrainsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TrainsService,
      mockTrain;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TrainsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TrainsService = _TrainsService_;

      // create mock Train
      mockTrain = new TrainsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Train Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Trains controller.
      TrainsController = $controller('TrainsController as vm', {
        $scope: $scope,
        trainResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTrainPostData;

      beforeEach(function () {
        // Create a sample Train object
        sampleTrainPostData = new TrainsService({
          name: 'Train Name'
        });

        $scope.vm.train = sampleTrainPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TrainsService) {
        // Set POST response
        $httpBackend.expectPOST('api/trains', sampleTrainPostData).respond(mockTrain);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Train was created
        expect($state.go).toHaveBeenCalledWith('trains.view', {
          trainId: mockTrain._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/trains', sampleTrainPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Train in $scope
        $scope.vm.train = mockTrain;
      });

      it('should update a valid Train', inject(function (TrainsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/trains\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('trains.view', {
          trainId: mockTrain._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TrainsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/trains\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Trains
        $scope.vm.train = mockTrain;
      });

      it('should delete the Train and redirect to Trains', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/trains\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('trains.list');
      });

      it('should should not delete the Train and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
