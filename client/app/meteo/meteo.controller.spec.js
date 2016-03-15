'use strict';

describe('Controller: MeteoCtrl', function () {

  // load the controller's module
  beforeEach(module('infovisApp'));

  var MeteoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MeteoCtrl = $controller('MeteoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
