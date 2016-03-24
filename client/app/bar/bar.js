'use strict';

angular.module('infovisApp.bar')
  .config(function($stateProvider) {
    $stateProvider
      .state('bar', {
        url: '/bar',
        templateUrl: 'app/bar/bar.html',
        controller: 'BarController',
        controllerAs: 'bar'
      });
  });
