'use strict';

angular.module('infovisApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('offices', {
        url: '/offices',
        templateUrl: 'app/offices/offices.html',
        controller: 'OfficesController',
        controllerAs: 'offices'
      });
  });
