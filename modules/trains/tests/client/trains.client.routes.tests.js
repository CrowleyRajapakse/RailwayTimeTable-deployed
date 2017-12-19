(function () {
  'use strict';

  describe('Trains Route Tests', function () {
    // Initialize global variables
    var $scope,
      TrainsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TrainsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TrainsService = _TrainsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('trains');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/trains');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TrainsController,
          mockTrain;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('trains.view');
          $templateCache.put('modules/trains/client/views/view-train.client.view.html', '');

          // create mock Train
          mockTrain = new TrainsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Train Name'
          });

          // Initialize Controller
          TrainsController = $controller('TrainsController as vm', {
            $scope: $scope,
            trainResolve: mockTrain
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:trainId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.trainResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            trainId: 1
          })).toEqual('/trains/1');
        }));

        it('should attach an Train to the controller scope', function () {
          expect($scope.vm.train._id).toBe(mockTrain._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/trains/client/views/view-train.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TrainsController,
          mockTrain;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('trains.create');
          $templateCache.put('modules/trains/client/views/form-train.client.view.html', '');

          // create mock Train
          mockTrain = new TrainsService();

          // Initialize Controller
          TrainsController = $controller('TrainsController as vm', {
            $scope: $scope,
            trainResolve: mockTrain
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.trainResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/trains/create');
        }));

        it('should attach an Train to the controller scope', function () {
          expect($scope.vm.train._id).toBe(mockTrain._id);
          expect($scope.vm.train._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/trains/client/views/form-train.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TrainsController,
          mockTrain;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('trains.edit');
          $templateCache.put('modules/trains/client/views/form-train.client.view.html', '');

          // create mock Train
          mockTrain = new TrainsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Train Name'
          });

          // Initialize Controller
          TrainsController = $controller('TrainsController as vm', {
            $scope: $scope,
            trainResolve: mockTrain
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:trainId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.trainResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            trainId: 1
          })).toEqual('/trains/1/edit');
        }));

        it('should attach an Train to the controller scope', function () {
          expect($scope.vm.train._id).toBe(mockTrain._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/trains/client/views/form-train.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
